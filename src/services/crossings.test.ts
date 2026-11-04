import { describe, it, expect, beforeEach } from 'vitest';
import { latLngToCell, gridDisk } from 'h3-js';
import {
  indexBridges, spokenFor, lookAhead, headsUpLine, HeadsUpGate, featurePhrase, roundedDistance,
  indexCrossingFeatures, _resetCrossingIndex, detectCrossings, segmentCrossing, CrossingGate,
  CrossingFeature, FEATURE_COOLDOWN_MS, metresBetween
} from './crossings';

// A square protected area near Maynooth, anticlockwise (inside on the left), as the pipeline writes it.
const W = -6.60, S = 53.380, E = -6.59, N = 53.386;
const ring = [W, S, E, S, E, N, W, N, W, S];
// A north-south river line west of the square.
const RX = -6.605;
const river = [RX, 53.37, RX, 53.39];

const sac: CrossingFeature = {
  kind: 'protected-area', name: 'Rye Water Valley/Carton', spoken: "You're entering the Rye Water Valley and Carton Special Area of Conservation, as listed by the National Parks and Wildlife Service.",
  priority: 2, siteKey: 'npws:001398', closed: true, sourceIds: ['npws:sac:001398'], sources: ['npws']
};
const pnha: CrossingFeature = { ...sac, priority: 5, sourceIds: ['npws:pnha:001398'] };
const rye: CrossingFeature = {
  kind: 'river', name: 'Rye Water', spoken: "You're crossing the Rye Water.", priority: 1, closed: false,
  sourceIds: ['epa:x'], sources: ['epa-rivers']
};

function cellsAround(lat: number, lng: number) {
  return gridDisk(latLngToCell(lat, lng, 8), 3);
}

beforeEach(() => {
  _resetCrossingIndex();
  const featureCells: Record<string, [string, number[]][]> = {};
  for (const c of cellsAround(53.383, -6.595)) featureCells[c] = [['npws-sac-001398', ring], ['npws-pnha-001398', ring]];
  for (const c of cellsAround(53.38, RX)) featureCells[c] = [...(featureCells[c] ?? []), ['epa-rye', river]];
  indexCrossingFeatures({ 'npws-sac-001398': sac, 'npws-pnha-001398': pnha, 'epa-rye': rye }, featureCells);
  // a recorded bridge on the river at 53.38 (and none at 53.375)
  indexBridges({ [latLngToCell(53.38, RX, 8)]: [[RX, 53.38, 'Rye Bridge', 'niah:11804001']] });
});

describe('bridges', () => {
  it('names the bridge when the crossing point is within 40 m of a recorded bridge', () => {
    const [e] = detectCrossings({ lat: 53.38, lng: RX - 0.001 }, { lat: 53.38, lng: RX + 0.001 });
    expect(e.bridge?.name).toBe('Rye Bridge');
    expect(spokenFor(e)).toBe("You're crossing the Rye Water, on Rye Bridge.");
  });
  it('no bridge named when the crossing is further away', () => {
    const [e] = detectCrossings({ lat: 53.375, lng: RX - 0.001 }, { lat: 53.375, lng: RX + 0.001 });
    expect(e.bridge).toBeUndefined();
    expect(spokenFor(e)).toBe("You're crossing the Rye Water.");
  });
});

describe('heads-up (coming up)', () => {
  it('finds the river ahead on the current heading and states the rounded distance', () => {
    // 700 m west of the river, heading due east (90°) at 80 km/h -> range ~1.33 km
    const pos = { lat: 53.383, lng: RX - 0.0105 };
    const x = lookAhead(pos, 90, 80)!;
    expect(x.event.featureId).toBe('epa-rye');
    expect(Math.round(x.metres / 100) * 100).toBe(700);
    expect(headsUpLine(x)).toBe('Coming up, about 700 metres ahead: the Rye Water.');
  });
  it('nothing when heading away, too slow, or too close', () => {
    expect(lookAhead({ lat: 53.383, lng: RX - 0.0105 }, 270, 80)).toBeNull();
    expect(lookAhead({ lat: 53.383, lng: RX - 0.0105 }, 90, 10)).toBeNull();
    expect(lookAhead({ lat: 53.383, lng: RX - 0.002 }, 90, 80)).toBeNull(); // ~130 m: the crossing itself will speak
  });
  it('protected areas are not heads-up material', () => {
    const x = lookAhead({ lat: 53.383, lng: -6.585 + 0.004 }, 270, 60);
    expect(x?.event.feature.kind ?? 'river').not.toBe('protected-area');
  });
  it('phrasing helpers', () => {
    expect(featurePhrase(rye)).toBe('the Rye Water');
    expect(roundedDistance(1100)).toBe('about a kilometre');
    expect(roundedDistance(260)).toBe('about 300 metres');
  });
  it('gate: once per feature, never over speech, not just after crossing', () => {
    const g = new HeadsUpGate();
    expect(g.decide('f', true, 0, false).reason).toBe('speech in progress');
    expect(g.decide('f', false, 0, true).reason).toBe('just crossed it');
    expect(g.decide('f', false, 0, false).play).toBe(true);
    g.markPlayed('f', 0);
    expect(g.decide('f', false, 60_000, false).reason).toBe('already announced');
  });
});

describe('segmentCrossing', () => {
  it('detects a proper crossing and which side we end on', () => {
    expect(segmentCrossing([0, -1], [0, 1], [-1, 0], [1, 0])).toBe(1); // ends left of q (north of an eastward line)
    expect(segmentCrossing([0, 1], [0, -1], [-1, 0], [1, 0])).toBe(-1);
  });
  it('parallel or non-touching segments are not crossings', () => {
    expect(segmentCrossing([0, 1], [2, 1], [0, 0], [2, 0])).toBe(0);
    expect(segmentCrossing([5, -1], [5, 1], [-1, 0], [1, 0])).toBe(0);
  });
});

describe('detectCrossings', () => {
  it('entering the area from outside is "enter"; leaving is "leave"', () => {
    const outside = { lat: 53.383, lng: -6.585 }, inside = { lat: 53.383, lng: -6.595 };
    const into = detectCrossings(outside, inside);
    expect(into.map((e) => [e.featureId, e.direction]).sort()).toEqual([['npws-pnha-001398', 'enter'], ['npws-sac-001398', 'enter']]);
    expect(detectCrossings(inside, outside).every((e) => e.direction === 'leave')).toBe(true);
  });
  it('driving alongside a river (never across it) is not a crossing', () => {
    expect(detectCrossings({ lat: 53.372, lng: RX + 0.0003 }, { lat: 53.388, lng: RX + 0.0003 })).toEqual([]);
  });
  it('driving across the river line is a crossing', () => {
    const ev = detectCrossings({ lat: 53.38, lng: RX - 0.001 }, { lat: 53.38, lng: RX + 0.001 });
    expect(ev.map((e) => [e.featureId, e.direction])).toEqual([['epa-rye', 'cross']]);
  });
  it('clipping a corner (in and out in one step) is not an entry', () => {
    const ev = detectCrossings({ lat: S + 0.001, lng: E + 0.002 }, { lat: S - 0.002, lng: E - 0.001 });
    expect(ev.filter((e) => e.feature.kind === 'protected-area')).toEqual([]);
  });
  it('metres helper is sane', () => {
    expect(Math.round(metresBetween({ lat: 53.38, lng: -6.6 }, { lat: 53.389, lng: -6.6 }))).toBe(1001);
  });
});

describe('CrossingGate', () => {
  const enter = (f: CrossingFeature, id: string) => ({ featureId: id, feature: f, direction: 'enter' as const, t: 1 });
  it('announces the highest priority, once per site (SAC and pNHA with one code count as one)', () => {
    const g = new CrossingGate();
    const d = g.decide([enter(pnha, 'p'), enter(sac, 's')], false, 0);
    expect(d.event?.feature).toBe(sac);
    g.markPlayed(d.event!, 0);
    expect(g.decide([enter(pnha, 'p')], false, 60_000).reason).toBe('already announced');
    expect(g.decide([enter(sac, 's')], false, FEATURE_COOLDOWN_MS).event?.feature).toBe(sac);
  });
  it('never plays over speech, never queues, never announces leaving', () => {
    const g = new CrossingGate();
    expect(g.decide([enter(sac, 's')], true, 0).reason).toBe('speech in progress');
    expect(g.decide([{ ...enter(sac, 's'), direction: 'leave' }], false, 0).event).toBeNull();
  });
  it('keeps 20 seconds between crossing announcements', () => {
    const g = new CrossingGate();
    g.markPlayed({ featureId: 'r', feature: rye, direction: 'cross', t: 1 }, 0);
    expect(g.decide([enter(sac, 's')], false, 5_000).reason).toBe('too soon after last crossing');
    expect(g.decide([enter(sac, 's')], false, 21_000).event?.feature).toBe(sac);
  });
});
