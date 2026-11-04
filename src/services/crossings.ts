import { gridDisk, gridPathCells, latLngToCell } from 'h3-js';
import type { GeoCoordinate } from '../types';

/**
 * Crossing detection: rivers, canals and protected areas.
 *
 * A crossing is EXACT: the straight line between two consecutive positions must intersect the
 * feature's geometry (built by pipeline/features.py). Driving alongside a river never counts.
 * Closed features (areas) have rings oriented with the inside on the LEFT, so we can tell
 * entering from leaving. Only entering is announced.
 */
export interface CrossingFeature {
  kind: 'protected-area' | 'river' | 'canal';
  name: string;
  displayName?: string;
  spoken: string;
  priority: number;
  siteKey?: string;
  closed: boolean;
  sourceIds: string[];
  sources: string[];
  url?: string;
}

export interface CrossingEvent {
  featureId: string;
  feature: CrossingFeature;
  direction: 'enter' | 'leave' | 'cross';
}

type Polyline = [string, number[]];
const featureIndex = new Map<string, CrossingFeature>();
const cellLines = new Map<string, Polyline[]>();

export function indexCrossingFeatures(
  features: Record<string, CrossingFeature> | undefined,
  featureCells: Record<string, Polyline[]> | undefined
): void {
  for (const [id, f] of Object.entries(features ?? {})) featureIndex.set(id, f);
  for (const [cell, lines] of Object.entries(featureCells ?? {})) {
    cellLines.set(cell, [...(cellLines.get(cell) ?? []), ...lines]);
  }
}

export function _resetCrossingIndex(): void {
  featureIndex.clear();
  cellLines.clear();
}

const cross = (ax: number, ay: number, bx: number, by: number) => ax * by - ay * bx;

/** Does segment p1→p2 properly intersect q1→q2? Returns the side p2 ends on (+1 left of q, -1 right). */
export function segmentCrossing(
  p1: [number, number], p2: [number, number], q1: [number, number], q2: [number, number]
): 0 | 1 | -1 {
  const rx = p2[0] - p1[0], ry = p2[1] - p1[1];
  const sx = q2[0] - q1[0], sy = q2[1] - q1[1];
  const denom = cross(rx, ry, sx, sy);
  if (denom === 0) return 0; // parallel or collinear: not a crossing
  const qpx = q1[0] - p1[0], qpy = q1[1] - p1[1];
  const t = cross(qpx, qpy, sx, sy) / denom;
  const u = cross(qpx, qpy, rx, ry) / denom;
  if (t <= 0 || t > 1 || u < 0 || u > 1) return 0;
  return cross(sx, sy, p2[0] - q1[0], p2[1] - q1[1]) > 0 ? 1 : -1;
}

function cellsBetween(a: GeoCoordinate, b: GeoCoordinate): Set<string> {
  const ca = latLngToCell(a.lat, a.lng, 8);
  const cb = latLngToCell(b.lat, b.lng, 8);
  let path: string[];
  try {
    path = gridPathCells(ca, cb);
  } catch {
    path = [ca, cb];
  }
  const out = new Set<string>();
  for (const c of path) for (const n of gridDisk(c, 1)) out.add(n);
  return out;
}

/** All features crossed moving from `prev` to `cur`. One event per feature. */
export function detectCrossings(prev: GeoCoordinate, cur: GeoCoordinate): CrossingEvent[] {
  const p1: [number, number] = [prev.lng, prev.lat];
  const p2: [number, number] = [cur.lng, cur.lat];
  const found = new Map<string, CrossingEvent>();
  for (const cell of cellsBetween(prev, cur)) {
    for (const [fid, coords] of cellLines.get(cell) ?? []) {
      const feature = featureIndex.get(fid);
      if (!feature) continue;
      for (let i = 0; i + 3 < coords.length; i += 2) {
        const side = segmentCrossing(p1, p2, [coords[i], coords[i + 1]], [coords[i + 2], coords[i + 3]]);
        if (!side) continue;
        const direction = !feature.closed ? 'cross' : side > 0 ? 'enter' : 'leave';
        const before = found.get(fid);
        // a segment that clips a corner enters and leaves: the net effect is what counts
        if (before && before.direction !== direction) found.delete(fid);
        else found.set(fid, { featureId: fid, feature, direction });
      }
    }
  }
  return [...found.values()];
}

/** Distance in metres (equirectangular; fine for a few hundred metres). */
export function metresBetween(a: GeoCoordinate, b: GeoCoordinate): number {
  const k = Math.PI / 180;
  const x = (b.lng - a.lng) * k * Math.cos(((a.lat + b.lat) / 2) * k);
  const y = (b.lat - a.lat) * k;
  return Math.sqrt(x * x + y * y) * 6371000;
}

export const FEATURE_COOLDOWN_MS = 30 * 60 * 1000;
export const MIN_GAP_MS = 20 * 1000;
/** Real GPS: a longer jump (tunnel, lost signal) is not trusted for crossings. */
export const MAX_GPS_SEGMENT_M = 400;

/**
 * Which crossing (if any) to announce. Rules (agreed with Barry: nothing is queued):
 *  - leaving an area is never announced;
 *  - nothing plays over speech already in progress (long-form or teaser);
 *  - one site is announced at most once per 30 minutes (a SAC and pNHA with the same site code count as one);
 *  - at most one crossing announcement per 20 seconds; the highest priority wins.
 */
export class CrossingGate {
  private lastBySite = new Map<string, number>();
  private lastAny = -Infinity;

  decide(events: CrossingEvent[], speaking: boolean, now: number): { event: CrossingEvent | null; reason: string } {
    const candidates = events
      .filter((e) => e.direction !== 'leave')
      .sort((a, b) => a.feature.priority - b.feature.priority);
    if (!candidates.length) return { event: null, reason: 'nothing entered' };
    const fresh = candidates.filter((e) => now - (this.lastBySite.get(this.key(e)) ?? -Infinity) >= FEATURE_COOLDOWN_MS);
    if (!fresh.length) return { event: null, reason: 'already announced' };
    if (speaking) return { event: null, reason: 'speech in progress' };
    if (now - this.lastAny < MIN_GAP_MS) return { event: null, reason: 'too soon after last crossing' };
    return { event: fresh[0], reason: 'ok' };
  }

  markPlayed(e: CrossingEvent, now: number): void {
    this.lastBySite.set(this.key(e), now);
    this.lastAny = now;
  }

  reset(): void {
    this.lastBySite.clear();
    this.lastAny = -Infinity;
  }

  private key(e: CrossingEvent): string {
    return e.feature.siteKey ?? e.featureId;
  }
}
