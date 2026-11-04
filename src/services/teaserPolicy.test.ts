import { describe, it, expect } from 'vitest';
import { TeaserGate, isLongFormTrack, DEFAULT_QUIET_GAP_MS } from './teaserPolicy';

const MIN = 60 * 1000;
const town = (id: string) => ({ areaId: id, kind: 'town' as const });
const rural = (id: string) => ({ areaId: id, kind: 'townland' as const, inBuiltUpArea: false });
const suburban = (id: string) => ({ areaId: id, kind: 'townland' as const, inBuiltUpArea: true });

describe('teaser policy: towns first (drive test 2026-11-03)', () => {
  it('replays the drive: a townland teaser no longer blocks Leixlip and Maynooth', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    // rural townland plays
    expect(g.decide(rural('tl:A'), false, 0).play).toBe(true);
    g.markPlayed('tl:A', 0);
    // one minute later: Leixlip; towns ignore the quiet gap
    expect(g.decide(town('town:Leixlip'), false, 1 * MIN).play).toBe(true);
    g.markPlayed('town:Leixlip', 1 * MIN);
    // two minutes later: Maynooth
    expect(g.decide(town('town:Maynooth'), false, 3 * MIN).play).toBe(true);
  });

  it('never speaks townlands inside built-up areas (e.g. Ballyowen in the Dublin suburbs)', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    expect(g.decide(suburban('tl:Ballyowen'), false, 0)).toEqual({ play: false, reason: 'built-up-townland' });
  });

  it('countryside townlands respect the quiet gap, measured from any teaser', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    g.markPlayed('town:Maynooth', 0);
    expect(g.decide(rural('tl:B'), false, 5 * MIN)).toEqual({ play: false, reason: 'quiet-gap' });
    expect(g.decide(rural('tl:B'), false, 10 * MIN).play).toBe(true);
  });

  it('each area plays once per trip, towns included', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    g.markPlayed('town:Leixlip', 0);
    expect(g.decide(town('town:Leixlip'), false, 1 * MIN)).toEqual({ play: false, reason: 'already-played' });
  });

  it('nothing ever plays over Tell me more, towns included', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    expect(g.decide(town('town:Lucan'), true, 0)).toEqual({ play: false, reason: 'long-form-active' });
  });

  it('does not queue: a town entered during Tell me more plays on the next cell entry inside it', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    expect(g.decide(town('town:Lucan'), true, 0).play).toBe(false);
    expect(g.decide(town('town:Lucan'), false, 1 * MIN).play).toBe(true);
  });

  it('never plays without a known area', () => {
    const g = new TeaserGate(0);
    expect(g.decide({ areaId: null }, false, 0)).toEqual({ play: false, reason: 'no-area' });
  });

  it('a user request bypasses played/gap/built-up, but never interrupts Tell me more', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    g.markPlayed('tl:A', 0);
    expect(g.decide(suburban('tl:A'), false, 10, true).play).toBe(true);
    expect(g.decide(suburban('tl:A'), true, 10, true)).toEqual({ play: false, reason: 'long-form-active' });
  });

  it('reset starts a new trip', () => {
    const g = new TeaserGate(DEFAULT_QUIET_GAP_MS);
    g.markPlayed('town:A', 0);
    g.reset();
    expect(g.decide(town('town:A'), false, 1).play).toBe(true);
  });

  it('classifies long-form tracks', () => {
    expect(isLongFormTrack('thread-abc')).toBe(true);
    expect(isLongFormTrack('cell-narrative-88abc')).toBe(true);
    expect(isLongFormTrack('ambient-teaser-town:A')).toBe(false);
  });
});
