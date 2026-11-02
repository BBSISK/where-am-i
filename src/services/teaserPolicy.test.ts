import { describe, it, expect } from 'vitest';
import { TeaserGate, isLongFormTrack, DEFAULT_QUIET_GAP_MS } from './teaserPolicy';

const MIN = 60 * 1000;

describe('teaser policy (agreed rule)', () => {
  it('plays once per area across multiple cells of that area', () => {
    const g = new TeaserGate(0);
    expect(g.decide('osm:Leixlip', false, 0).play).toBe(true);
    g.markPlayed('osm:Leixlip', 0);
    // next cells in the same area
    expect(g.decide('osm:Leixlip', false, 1 * MIN)).toEqual({ play: false, reason: 'already-played' });
    expect(g.decide('osm:Leixlip', false, 2 * MIN)).toEqual({ play: false, reason: 'already-played' });
  });

  it('never plays while Tell me more is playing or paused', () => {
    const g = new TeaserGate(0);
    expect(g.decide('osm:Maynooth', true, 0)).toEqual({ play: false, reason: 'long-form-active' });
  });

  it('does not queue: entering B during Tell me more, then Tell me more ends, plays nothing by itself', () => {
    const g = new TeaserGate(0);
    // entered B while long-form active -> blocked, nothing recorded
    expect(g.decide('osm:B', true, 0).play).toBe(false);
    // no call happens when long-form ends; the gate holds no pending teaser
    // next cell entry inside B, long-form finished -> plays now
    expect(g.decide('osm:B', false, 1 * MIN).play).toBe(true);
  });

  it('respects the minimum quiet gap between teasers', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    g.markPlayed('osm:A', 0);
    expect(g.decide('osm:B', false, 1 * MIN)).toEqual({ play: false, reason: 'quiet-gap' });
    expect(g.decide('osm:B', false, 3 * MIN).play).toBe(true);
  });

  it('never plays without a known area', () => {
    const g = new TeaserGate(0);
    expect(g.decide(null, false, 0)).toEqual({ play: false, reason: 'no-area' });
    expect(g.decide('', false, 0)).toEqual({ play: false, reason: 'no-area' });
  });

  it('a user request bypasses played/gap but never interrupts Tell me more', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    g.markPlayed('osm:A', 0);
    expect(g.decide('osm:A', false, 10, true).play).toBe(true);
    expect(g.decide('osm:A', true, 10, true)).toEqual({ play: false, reason: 'long-form-active' });
  });

  it('reset starts a new trip', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    g.markPlayed('osm:A', 0);
    g.reset();
    expect(g.decide('osm:A', false, 1).play).toBe(true);
  });

  it('classifies long-form tracks', () => {
    expect(isLongFormTrack('thread-abc')).toBe(true);
    expect(isLongFormTrack('cell-narrative-88abc')).toBe(true);
    expect(isLongFormTrack('ambient-teaser-osm:A')).toBe(false);
    expect(isLongFormTrack(null)).toBe(false);
  });
});
