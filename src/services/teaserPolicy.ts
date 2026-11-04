/**
 * Teaser policy.
 *
 * Agreed with Barry 2026-11-02, revised after the drive test of 2026-11-03 ("towns first").
 * An area's teaser plays automatically only when ALL of these are true:
 *   (a) we are in a cell that belongs to a known area,
 *   (b) no long-form audio ("Tell me more") is playing or paused,
 *   (c) that area has not already had its teaser on this trip,
 *   (d) TOWNS: always allowed (no quiet gap), so a town is never missed.
 *       TOWNLANDS / other places: only outside built-up areas, and only if the quiet gap
 *       (default 10 min) has passed since the last teaser of any kind.
 * Nothing is queued: a blocked teaser simply does not play now.
 * A user's explicit request (e.g. tapping Replay) bypasses (c) and (d), but never (a) or (b).
 */

export const DEFAULT_QUIET_GAP_MS = 10 * 60 * 1000;

export type AreaKind = 'town' | 'townland' | 'place';

export type TeaserDecision =
  | { play: true }
  | { play: false; reason: 'no-area' | 'already-played' | 'long-form-active' | 'quiet-gap' | 'built-up-townland' };

export interface TeaserInput {
  areaId: string | null | undefined;
  kind?: AreaKind;
  inBuiltUpArea?: boolean;
  playedAreas: ReadonlySet<string>;
  longFormActive: boolean;
  lastTeaserAt: number | null;
  now: number;
  quietGapMs: number;
  userRequested?: boolean;
}

export function shouldPlayTeaser(i: TeaserInput): TeaserDecision {
  if (!i.areaId) return { play: false, reason: 'no-area' };
  if (i.longFormActive) return { play: false, reason: 'long-form-active' };
  if (i.userRequested) return { play: true };
  if (i.playedAreas.has(i.areaId)) return { play: false, reason: 'already-played' };
  if (i.kind === 'town') return { play: true };
  if (i.inBuiltUpArea) return { play: false, reason: 'built-up-townland' };
  if (i.lastTeaserAt !== null && i.now - i.lastTeaserAt < i.quietGapMs) return { play: false, reason: 'quiet-gap' };
  return { play: true };
}

/** Long-form audio = "Tell me more" content. Teasers must never interrupt it. */
export function isLongFormTrack(trackId: string | null | undefined): boolean {
  return !!trackId && (trackId.startsWith('thread-') || trackId.startsWith('cell-narrative-'));
}

export interface AreaInfo {
  areaId: string | null | undefined;
  kind?: AreaKind;
  inBuiltUpArea?: boolean;
}

/** Small stateful wrapper for one trip. */
export class TeaserGate {
  private played = new Set<string>();
  private lastTeaserAt: number | null = null;
  constructor(public quietGapMs: number = DEFAULT_QUIET_GAP_MS) {}

  decide(area: AreaInfo, longFormActive: boolean, now: number, userRequested = false): TeaserDecision {
    return shouldPlayTeaser({
      areaId: area.areaId, kind: area.kind, inBuiltUpArea: area.inBuiltUpArea,
      playedAreas: this.played, longFormActive, lastTeaserAt: this.lastTeaserAt, now,
      quietGapMs: this.quietGapMs, userRequested
    });
  }

  markPlayed(areaId: string, now: number): void {
    this.played.add(areaId);
    this.lastTeaserAt = now;
  }

  /** Start a new trip: forget played areas and the gap timer. */
  reset(): void {
    this.played.clear();
    this.lastTeaserAt = null;
  }
}
