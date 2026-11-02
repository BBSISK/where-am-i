import { describe, it, expect, beforeEach } from 'vitest';
import { indexAreaFile, lookupArea, cellFromArea, _resetAreaIndex, AreaFile } from './areaData';

const doc: AreaFile = {
  county: 'kildare',
  h3Resolution: 8,
  sources: {
    logainm: { name: 'Logainm', url: 'https://www.logainm.ie', licence: 'CC BY 4.0', attribution: 'Logainm attribution' },
    'tailte-urban': { name: 'Tailte', url: 'https://example', licence: 'CC BY 4.0', attribution: '© Tailte Éireann' }
  },
  areas: {
    'town:logainm:1416490': {
      id: 'town:logainm:1416490', kind: 'town', name: 'Leixlip', nameGa: 'Léim an Bhradáin', logainmId: 1416490,
      logainmUrl: 'https://www.logainm.ie/1416490.aspx', glossary: [{ id: 7, headword: 'léim', translation: 'leap' }],
      teaser: 'Leixlip, a town. In Irish, Léim an Bhradáin.',
      sentences: [{ text: 'Leixlip, a town.', sourceIds: ['logainm:1416490'] }, { text: 'In Irish, Léim an Bhradáin.', sourceIds: ['logainm:1416490'] }],
      sources: ['logainm', 'tailte-urban']
    },
    'townland:logainm:25266': {
      id: 'townland:logainm:25266', kind: 'townland', name: 'Rathcoffey Demesne', nameGa: null, logainmId: 25266,
      logainmUrl: null, glossary: [], teaser: 'Rathcoffey Demesne, a townland in the civil parish of Balraheen.',
      sentences: [{ text: 'Rathcoffey Demesne, a townland in the civil parish of Balraheen.', sourceIds: ['logainm:25266'] }],
      sources: ['logainm']
    }
  },
  cells: { '88aaa': 'town:logainm:1416490', '88bbb': 'town:logainm:1416490', '88ccc': 'townland:logainm:25266' }
};

describe('areaData', () => {
  beforeEach(() => { _resetAreaIndex(); indexAreaFile(doc); });

  it('maps every cell of a town to the same area', () => {
    expect(lookupArea('88aaa')!.area.id).toBe(lookupArea('88bbb')!.area.id);
    expect(lookupArea('88zzz')).toBeNull();
  });

  it('builds a cell that speaks exactly the sourced teaser and credits its sources', () => {
    const f = lookupArea('88aaa')!;
    const cell = cellFromArea(f.area, f.registry, '88aaa', { lat: 53.36, lng: -6.49 });
    expect(cell.areaId).toBe('town:logainm:1416490');
    expect(cell.teaserScript).toBe('Leixlip, a town. In Irish, Léim an Bhradáin.');
    expect(cell.etymology?.irishName).toBe('Léim an Bhradáin');
    expect(cell.etymology?.rootWords).toEqual([{ root: 'léim', meaning: 'leap' }]);
    expect(cell.sources.map((s) => s.id)).toEqual(['logainm', 'tailte-urban']);
    expect(cell.sources[0].url).toBe('https://www.logainm.ie/1416490.aspx');
  });

  it('no validated Irish name means no etymology card', () => {
    const f = lookupArea('88ccc')!;
    const cell = cellFromArea(f.area, f.registry, '88ccc', { lat: 53.33, lng: -6.67 });
    expect(cell.etymology).toBeUndefined();
    expect(cell.teaserScript).not.toContain('In Irish');
  });
});
