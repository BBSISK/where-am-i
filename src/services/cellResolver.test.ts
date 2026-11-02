import { describe, it, expect } from 'vitest';
import { buildVerifiedCell, cellFromWaypoint, honestTeaser, OSM_SOURCE } from './cellResolver';

describe('cellResolver (verified-only)', () => {
  const c = { lat: 53.38, lng: -6.59 };

  it('claims nothing beyond the place name', () => {
    const cell = buildVerifiedCell('88abc', c, 'Maynooth', 'Kildare', [OSM_SOURCE]);
    expect(cell.etymology).toBeUndefined();
    expect(cell.folklore).toBeUndefined();
    expect(cell.geology).toBeUndefined();
    expect(cell.monuments).toEqual([]);
    expect(cell.threads).toEqual([]);
    expect(cell.keyHighlights).toEqual([]);
    expect(cell.curatedByAgent).toBe(false);
  });

  it('cites OSM whenever an OSM place name is used', () => {
    const cell = buildVerifiedCell('88abc', c, 'Maynooth', 'Kildare', [OSM_SOURCE]);
    expect(cell.sources.map(s => s.id)).toContain('osm-nominatim');
    expect(OSM_SOURCE.attribution).toBe('© OpenStreetMap contributors');
  });

  it('says plainly that no verified history exists yet', () => {
    expect(honestTeaser('Leixlip')).toBe("You're near Leixlip. Verified place-name history for this area isn't available yet.");
    expect(honestTeaser(null)).toContain("isn't available yet");
  });

  it('simulated waypoints carry only their plain name and no sources', () => {
    const cell = cellFromWaypoint('Lucan', '88def', c);
    expect(cell.townland).toBe('Lucan');
    expect(cell.sources).toEqual([]);
    expect(cell.etymology).toBeUndefined();
  });

  it('gives every cell of the same place the same areaId (one teaser per area)', () => {
    const a = buildVerifiedCell('88a', c, 'Leixlip', 'Kildare', [OSM_SOURCE], 'osm:Leixlip|Kildare');
    const b = buildVerifiedCell('88b', c, 'Leixlip', 'Kildare', [OSM_SOURCE], 'osm:Leixlip|Kildare');
    expect(a.areaId).toBe(b.areaId);
    expect(cellFromWaypoint('Lucan', '88c', c).areaId).toBe('sim:Lucan');
  });
});
