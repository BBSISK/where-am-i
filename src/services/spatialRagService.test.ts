import { describe, it, expect } from 'vitest';
import { spatialRagService, AreaKnowledgeUnit } from './spatialRagService';

describe('Spatial RAG Engine', () => {
  const sampleArea: AreaKnowledgeUnit = {
    areaId: 'area-naas-01',
    townland: 'Naas',
    irishName: 'Nás na Ríogh',
    phonetic: 'Nawss nah Reeg',
    county: 'Kildare',
    parish: 'Naas',
    coordinates: { lat: 53.2158, lng: -6.6669 },
    h3Indices: [],
    etymology: {
      irishName: 'Nás na Ríogh',
      englishName: 'Naas',
      phonetic: 'Nawss nah Reeg',
      rootWords: [{ root: 'Nás', meaning: 'Assembly place or meeting ground of kings' }],
      explanation: 'Ancient assembly site and royal seat of the Kings of Leinster prior to the Norman invasion.',
      source: 'Logainm.ie'
    },
    monuments: [
      {
        id: 'mon-naas-01',
        name: 'The North Moat of Naas',
        type: 'Castle',
        era: 'Medieval',
        distanceMeters: 120,
        description: 'Anglo-Norman motte built on the site of an ancient Leinster royal inauguration mound.',
        smrNumber: 'KD019-030----'
      }
    ],
    folklore: {
      title: 'The Royal Assemblies of Leinster',
      informant: 'Recorded in 1937 National Folklore Collection',
      schoolName: 'Naas Christian Brothers School',
      parish: 'Naas',
      county: 'Kildare',
      yearRecorded: 1937,
      storySnippet: 'Elders recounted how the ancient High Kings held triennial feasts on the mound of Naas.',
      category: 'Local Hero',
      duchasVolumeId: 'NFC-KD-0042'
    },
    geology: {
      name: 'Kildare Limestone & Glacial Gravels',
      type: 'Esker',
      ageEpoch: 'Carboniferous',
      scientificInsight: 'Underlain by dense limestone beds mantle-covered by glacial outwash sands.'
    },
    teaserScript: 'Approaching Naas, Nás na Ríogh—ancient assembly place of the Kings of Leinster.',
    narrativeScript: 'Welcome to Naas, the historic meeting place of the Gaelic kings of Leinster.',
    threads: [
      {
        id: 'naas-mound',
        title: 'The Inauguration Mound of the Leinster Kings',
        category: 'monument',
        hookSnippet: 'Where ancient kings were crowned before Norman earthworks reshaped the summit.',
        spokenNarrative: 'The great North Moat of Naas stands atop an ancient ceremonial inauguration site. Here the Kings of Leinster held great assemblies, surrounded by earthen banks that predate the Norman conquest.',
        detailMarkdown: 'Historic Sites & Monuments Record KD019-030.'
      }
    ]
  };

  it('registers an area knowledge unit and decomposes it into spatial RAG chunks', () => {
    spatialRagService.registerArea(sampleArea);

    const resolved = spatialRagService.resolveArea(sampleArea.coordinates);
    expect(resolved).toBeDefined();
    expect(resolved?.townland).toBe('Naas');
    expect(resolved?.irishName).toBe('Nás na Ríogh');
  });

  it('retrieves corridor chunks within physical H3 resolution 8 proximity', () => {
    spatialRagService.registerArea(sampleArea);

    const chunks = spatialRagService.retrieveCorridorChunks(sampleArea.coordinates);
    expect(chunks.length).toBeGreaterThanOrEqual(4);
    expect(chunks.some(c => c.category === 'etymology')).toBe(true);
    expect(chunks.some(c => c.category === 'monument')).toBe(true);
    expect(chunks.some(c => c.category === 'folklore')).toBe(true);
  });

  it('performs intent-based semantic ranking over retrieved corridor chunks', () => {
    spatialRagService.registerArea(sampleArea);

    const monumentChunks = spatialRagService.retrieveCorridorChunks(sampleArea.coordinates, 'motte castle kings');
    expect(monumentChunks.length).toBeGreaterThan(0);
    expect(monumentChunks[0].content.toLowerCase()).toContain('motte');
  });

  describe('N4 Corridor (Lucan, Leixlip, Maynooth) 6-Pillar Knowledge Base', () => {
    it('has Lucan, Leixlip, and Maynooth pre-registered on boot', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      const leixlip = spatialRagService.getAreaByName('Leixlip');
      const maynooth = spatialRagService.getAreaByName('Maynooth');

      expect(lucan).toBeDefined();
      expect(lucan?.irishName).toBe('Leamhcán');
      expect(lucan?.county).toBe('Dublin');

      expect(leixlip).toBeDefined();
      expect(leixlip?.irishName).toBe('Léim an Bhradáin');
      expect(leixlip?.county).toBe('Kildare');

      expect(maynooth).toBeDefined();
      expect(maynooth?.irishName).toBe('Maigh Nuadhad');
      expect(maynooth?.county).toBe('Kildare');
    });

    it('indexes all 6 cultural pillars including history and waterways for Lucan', () => {
      const lucanCoord = { lat: 53.3575, lng: -6.4485 };
      const chunks = spatialRagService.retrieveCorridorChunks(lucanCoord);

      expect(chunks.some(c => c.category === 'etymology')).toBe(true);
      expect(chunks.some(c => c.category === 'monument')).toBe(true);
      expect(chunks.some(c => c.category === 'folklore')).toBe(true);
      expect(chunks.some(c => c.category === 'geology')).toBe(true);
      expect(chunks.some(c => c.category === 'history')).toBe(true);
      expect(chunks.some(c => c.category === 'waterways')).toBe(true);

      const sarsfieldChunk = chunks.find(c => c.category === 'history');
      expect(sarsfieldChunk?.content).toContain('Patrick Sarsfield');

      const waterwayChunk = chunks.find(c => c.category === 'waterways');
      expect(waterwayChunk?.content).toContain('River Liffey');
    });

    it('indexes Guinness 1755 brewery genesis and Viking Lax-hlaup for Leixlip', () => {
      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.history?.figure).toContain('Arthur Guinness');
      expect(leixlip?.waterways?.name).toContain('Rye Water');
    });

    it('indexes Silken Thomas and the Royal Canal for Maynooth', () => {
      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.history?.figure).toContain('Silken Thomas');
      expect(maynooth?.waterways?.type).toBe('Canal');
    });

    it('resolves coordinates along the N4 corridor to the closest townland within 4km', () => {
      // Point on N4 near Lucan bypass (lat: 53.3590, lng: -6.4520)
      const nearLucan = spatialRagService.resolveArea({ lat: 53.3590, lng: -6.4520 });
      expect(nearLucan?.townland).toBe('Lucan');

      // Point on M4 near Maynooth Junction 7 (lat: 53.3750, lng: -6.5850)
      const nearMaynooth = spatialRagService.resolveArea({ lat: 53.3750, lng: -6.5850 });
      expect(nearMaynooth?.townland).toBe('Maynooth');
    });

    it('converts an AreaKnowledgeUnit into a full EnrichedH3Cell with all 6 pillars', () => {
      const maynooth = spatialRagService.getAreaByName('Maynooth')!;
      const enrichedCell = spatialRagService.toEnrichedCell(maynooth, 'test-h3-index', maynooth.coordinates);

      expect(enrichedCell.townland).toBe('Maynooth');
      expect(enrichedCell.county).toBe('Kildare');
      expect(enrichedCell.history).toBeDefined();
      expect(enrichedCell.history?.title).toContain('Silken Thomas');
      expect(enrichedCell.waterways).toBeDefined();
      expect(enrichedCell.waterways?.name).toContain('Royal Canal');
      expect(enrichedCell.threads.length).toBeGreaterThanOrEqual(3);
    });
  });
});

