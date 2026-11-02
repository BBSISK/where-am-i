/**
 * Teaser policy (agreed with Barry, 2026-11-02).
 *
 * An area's teaser plays automatically only when ALL of these are true:
 *   (a) we are in a cell that belongs to a known area,
 *   (b) that area has not already had its teaser on this trip,
 *   (c) no long-form audio ("Tell me more") is playing or paused, and
 *   (d) the minimum quiet gap since the last teaser has elapsed.
 * Nothing is queued: if (c) or (d) blocks it, the teaser is simply not played now. It may play on the
 * next cell entry within the same area, once the blocker has cleared.
 * A user's explicit request (e.g. tapping Replay) bypasses (b) and (d), but never (a) or (c).
 */

export const DEFAULT_QUIET_GAP_MS = 3 * 60 * 1000;

export type TeaserDecision =
  | { play: true }
  | { play: false; reason: 'no-area' | 'already-played' | 'long-form-active' | 'quiet-gap' };

export interface TeaserInput {
  areaId: string | null | undefined;
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
  if (i.lastTeaserAt !== null && i.now - i.lastTeaserAt < i.quietGapMs) return { play: false, reason: 'quiet-gap' };
  return { play: true };
}

/** Long-form audio = "Tell me more" content. Teasers must never interrupt it. */
export function isLongFormTrack(trackId: string | null | undefined): boolean {
  return !!trackId && (trackId.startsWith('thread-') || trackId.startsWith('cell-narrative-'));
}

/** Small stateful wrapper for one trip. */
export class TeaserGate {
  private played = new Set<string>();
  private lastTeaserAt: number | null = null;
  constructor(public quietGapMs: number = DEFAULT_QUIET_GAP_MS) {}

  decide(areaId: string | null | undefined, longFormActive: boolean, now: number, userRequested = false): TeaserDecision {
    return shouldPlayTeaser({ areaId, playedAreas: this.played, longFormActive, lastTeaserAt: this.lastTeaserAt, now, quietGapMs: this.quietGapMs, userRequested });
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
