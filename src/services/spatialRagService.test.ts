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
});
