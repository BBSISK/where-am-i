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

    it('resolves neighborhood aliases like Griffeen, Adamstown, and Lucan Village', () => {
      expect(spatialRagService.getAreaByName('Griffeen')?.townland).toBe('Lucan');
      expect(spatialRagService.getAreaByName('Griffeen Bridge')?.townland).toBe('Lucan');
      expect(spatialRagService.getAreaByName('Adamstown')?.townland).toBe('Lucan');
      expect(spatialRagService.getAreaByName('Lucan Village')?.townland).toBe('Lucan');
      expect(spatialRagService.getAreaByName('Confey')?.townland).toBe('Leixlip');
      expect(spatialRagService.getAreaByName('Carton')?.townland).toBe('Maynooth');
    });

    it('resolves coordinates along the N4 corridor to the closest townland within 6.5km', () => {
      // Point on N4 near Lucan bypass (lat: 53.3590, lng: -6.4520)
      const nearLucan = spatialRagService.resolveArea({ lat: 53.3590, lng: -6.4520 });
      expect(nearLucan?.townland).toBe('Lucan');

      // Point in Adamstown / Lucan South (lat: 53.3440, lng: -6.4620, ~1.8km from Lucan center)
      const adamstown = spatialRagService.resolveArea({ lat: 53.3440, lng: -6.4620 });
      expect(adamstown?.townland).toBe('Lucan');

      // Point on M4 near Maynooth Junction 7 (lat: 53.3750, lng: -6.5850)
      const nearMaynooth = spatialRagService.resolveArea({ lat: 53.3750, lng: -6.5850 });
      expect(nearMaynooth?.townland).toBe('Maynooth');
    });

    it('converts an AreaKnowledgeUnit into a full EnrichedH3Cell with all 6 pillars and council sources', () => {
      const maynooth = spatialRagService.getAreaByName('Maynooth')!;
      const enrichedCell = spatialRagService.toEnrichedCell(maynooth, 'test-h3-index', maynooth.coordinates);

      expect(enrichedCell.townland).toBe('Maynooth');
      expect(enrichedCell.county).toBe('Kildare');
      expect(enrichedCell.history).toBeDefined();
      expect(enrichedCell.history?.title).toContain('Silken Thomas');
      expect(enrichedCell.waterways).toBeDefined();
      expect(enrichedCell.waterways?.name).toContain('Royal Canal');
      expect(enrichedCell.councilSource).toBeDefined();
      expect(enrichedCell.councilSource?.councilName).toContain('Kildare County Council');
      expect(enrichedCell.threads.length).toBeGreaterThanOrEqual(4);
    });

    it('indexes local county council and historical society sources for all N4 areas', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.councilSource?.councilName).toContain('South Dublin County Council');
      expect(lucan?.councilSource?.historicalSociety).toContain('Society for Old Lucan');
      expect(lucan?.monuments.some(m => m.name.includes('Shackleton'))).toBe(true);
      expect(lucan?.monuments.some(m => m.name.includes("St. Finian's"))).toBe(true);

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.councilSource?.councilName).toContain('Kildare County Council');
      expect(leixlip?.councilSource?.historicalSociety).toContain('Leixlip History Club');
      expect(leixlip?.monuments.some(m => m.name.includes('Aqueduct'))).toBe(true);

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.councilSource?.keyHighlights.some(h => h.includes('Nicholas Callan'))).toBe(true);
      expect(maynooth?.monuments.some(m => m.name.includes('Silken Thomas Yew'))).toBe(true);
      expect(maynooth?.monuments.some(m => m.name.includes('Nicholas Callan'))).toBe(true);
    });

    it('indexes authentic 1911 Census and Griffith Valuation records across the N4 corridor', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.census).toBeDefined();
      expect(lucan?.census?.totalPopulation).toBe(792);
      expect(lucan?.census?.inhabitedHouses).toBe(162);
      expect(lucan?.census?.famineImpact.changePct).toBe('-28.2%');
      expect(lucan?.census?.griffithsValuation.predominantFamilyNames).toContain('Shackleton');

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.census).toBeDefined();
      expect(leixlip?.census?.roofTypes.thatchOrWood).toBe(33);
      expect(leixlip?.census?.topOccupations.some(o => o.includes('Lockkeepers'))).toBe(true);

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.census).toBeDefined();
      expect(maynooth?.census?.literacyRatePct).toBe(93.4);
      expect(maynooth?.census?.griffithsValuation.primaryLessor).toContain('Duke of Leinster');

      // Test RAG search retrieval on census intents
      const lucanCoord = { lat: 53.3575, lng: -6.4485 };
      const censusChunks = spatialRagService.retrieveCorridorChunks(lucanCoord, 'census population 1911 valuation');
      expect(censusChunks.length).toBeGreaterThan(0);
      expect(censusChunks[0].title).toContain('1911 Census');
    });

    it('indexes Art and National Gallery of Ireland (NGI) references for all areas', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.artReferences).toBeDefined();
      expect(lucan?.artReferences?.some(a => a.artist.includes('William Ashford'))).toBe(true);
      expect(lucan?.artReferences?.some(a => a.artist.includes('Agostino Carlini'))).toBe(true);
      expect(lucan?.artReferences?.some(a => a.galleryOrCollection.includes('National Gallery of Ireland'))).toBe(true);

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.artReferences).toBeDefined();
      expect(leixlip?.artReferences?.some(a => a.artworkTitle.includes('The Salmon Leap') && a.artist.includes('Francis Wheatley'))).toBe(true);
      expect(leixlip?.artReferences?.some(a => a.catalogRef === 'NGI.4363')).toBe(true);

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.artReferences).toBeDefined();
      expect(maynooth?.artReferences?.some(a => a.artist.includes('Francini'))).toBe(true);
      expect(maynooth?.artReferences?.some(a => a.artist.includes('Thomas Roberts'))).toBe(true);
      expect(maynooth?.artReferences?.some(a => a.artist.includes('Augustus Welby Pugin'))).toBe(true);

      // Test RAG search retrieval for art intents
      const leixlipCoord = { lat: 53.3639, lng: -6.4950 };
      const artChunks = spatialRagService.retrieveCorridorChunks(leixlipCoord, 'Wheatley Salmon Leap National Gallery');
      expect(artChunks.length).toBeGreaterThan(0);
      expect(artChunks[0].content).toContain('Francis Wheatley');
    });

    it('indexes Diaspora & Global Ties including Lucan Parco Italia and Leixlip Intel', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.communityLinks).toBeDefined();
      const italianLink = lucan?.communityLinks?.find(l => l.communityName.includes('Parco Italia'));
      expect(italianLink).toBeDefined();
      expect(italianLink?.flagEmoji).toBe('🇮🇹');
      expect(italianLink?.narrative).toContain('Sergio Mattarella');
      expect(italianLink?.summary).toContain('€10.5M');

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.communityLinks?.some(l => l.communityName.includes('Viking'))).toBe(true);
      expect(leixlip?.communityLinks?.some(l => l.communityName.includes('Intel Ireland'))).toBe(true);

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.communityLinks?.some(l => l.communityName.includes('Sorbonne'))).toBe(true);

      // Test RAG search retrieval for Italian connection in Lucan
      const lucanCoord = { lat: 53.3575, lng: -6.4485 };
      const italyChunks = spatialRagService.retrieveCorridorChunks(lucanCoord, 'Italian Ambassador Parco Italia');
      expect(italyChunks.length).toBeGreaterThan(0);
      expect(italyChunks[0].content).toContain('Parco Italia');
    });

    it('indexes live CSO 2022 Census data showing modern growth and tech profiles', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.csoModern).toBeDefined();
      expect(lucan?.csoModern?.population2022).toBe(57575);
      expect(lucan?.csoModern?.growthFrom1911Pct).toBe('+7,169%');

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.csoModern).toBeDefined();
      expect(leixlip?.csoModern?.population2022).toBe(16733);
      expect(leixlip?.csoModern?.demographicProfile).toContain('STEM');

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.csoModern).toBeDefined();
      expect(maynooth?.csoModern?.population2022).toBe(17259);
      expect(maynooth?.csoModern?.demographicProfile).toContain('28.4 years');
    });

    it('indexes famous local figures across art, science, and history', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.famousFigures?.some(f => f.name.includes('Patrick Sarsfield'))).toBe(true);
      expect(lucan?.famousFigures?.some(f => f.name.includes('Carlini'))).toBe(true);
      expect(lucan?.famousFigures?.some(f => f.name.includes('Shackleton'))).toBe(true);

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.famousFigures?.some(f => f.name.includes('Arthur Guinness'))).toBe(true);
      expect(leixlip?.famousFigures?.some(f => f.name.includes('Desmond Guinness'))).toBe(true);

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.famousFigures?.some(f => f.name.includes('Paul Mescal'))).toBe(true);
      expect(maynooth?.famousFigures?.some(f => f.name.includes('Nicholas Callan'))).toBe(true);

      // Test RAG retrieval for Paul Mescal in Maynooth
      const maynoothCoord = { lat: 53.3813, lng: -6.5918 };
      const mescalChunks = spatialRagService.retrieveCorridorChunks(maynoothCoord, 'Paul Mescal actor Gladiator');
      expect(mescalChunks.length).toBeGreaterThan(0);
      expect(mescalChunks[0].content).toContain('Paul Mescal');
    });

    it('indexes NIAH Built Heritage records across Lucan, Leixlip, and Maynooth', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.niahHeritage).toBeDefined();
      expect(lucan?.niahHeritage?.some(h => h.regNumber === '11202005' && (h.buildingName || h.name || '').includes('Lucan Bridge'))).toBe(true);

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.niahHeritage).toBeDefined();
      expect(leixlip?.niahHeritage?.some(h => (h.buildingName || h.name || '').includes('Toll House'))).toBe(true);

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.niahHeritage).toBeDefined();
      expect(maynooth?.niahHeritage?.some(h => (h.buildingName || h.name || '').includes('Railway Station'))).toBe(true);

      // Test RAG retrieval for NIAH architecture
      const lucanCoord = { lat: 53.3575, lng: -6.4485 };
      const niahChunks = spatialRagService.retrieveCorridorChunks(lucanCoord, 'NIAH architectural heritage stone bridge');
      expect(niahChunks.length).toBeGreaterThan(0);
      expect(niahChunks.some(c => c.category === 'architecture')).toBe(true);
    });

    it('indexes NBDC Biodiversity and Special Areas of Conservation (SACs)', () => {
      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.biodiversity).toBeDefined();
      expect(leixlip?.biodiversity?.sacOrSpa).toContain('Rye Water Valley / Carton SAC');
      expect(leixlip?.biodiversity?.indicatorSpecies.some(s => s.scientificName === 'Vertigo angustior')).toBe(true);
      expect(leixlip?.biodiversity?.indicatorSpecies.some(s => s.commonName.includes('Tufa'))).toBe(true);

      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.biodiversity?.indicatorSpecies.some(s => s.commonName.includes('Daubenton'))).toBe(true);

      // Test RAG retrieval for SAC ecology
      const leixlipCoord = { lat: 53.3639, lng: -6.4950 };
      const ecoChunks = spatialRagService.retrieveCorridorChunks(leixlipCoord, 'whorl snail tufa springs SAC');
      expect(ecoChunks.length).toBeGreaterThan(0);
      expect(ecoChunks.some(c => c.category === 'ecology')).toBe(true);
    });

    it('indexes Bureau of Military History (1913–1921) witness statements', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.militaryWitnesses?.some(w => w.bureauRef === 'BMH WS 0768' && w.summary.includes('Lucan RIC Barracks'))).toBe(true);

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.militaryWitnesses?.some(w => w.bureauRef === 'BMH WS 0532' && w.summary.includes('Louisa Bridge'))).toBe(true);

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.militaryWitnesses?.some(w => w.witnessName === 'Patrick Colgan' && w.eyewitnessExcerpt.includes('General Post Office'))).toBe(true);

      // Test RAG retrieval for military witness statements
      const maynoothCoord = { lat: 53.3813, lng: -6.5918 };
      const militaryChunks = spatialRagService.retrieveCorridorChunks(maynoothCoord, 'GPO Easter Rising Volunteers march');
      expect(militaryChunks.length).toBeGreaterThan(0);
      expect(militaryChunks.some(c => c.category === 'military')).toBe(true);
    });

    it('indexes Motorway Archaeology from TII rescue excavations and NMI artifacts', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.motorwayArchaeology?.some(m => m.siteName.includes('Ballydowd') && m.discovery.includes('fulachtaí fia'))).toBe(true);

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.motorwayArchaeology?.some(m => m.museumArtifacts?.some(a => a.includes('Viking')))).toBe(true);

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.motorwayArchaeology?.some(m => m.discovery.includes('amber beads') && m.roadScheme.includes('M4'))).toBe(true);

      // Test RAG retrieval for excavation
      const maynoothCoord = { lat: 53.3813, lng: -6.5918 };
      const excavChunks = spatialRagService.retrieveCorridorChunks(maynoothCoord, 'Railpark Bronze Age amber motorway');
      expect(excavChunks.length).toBeGreaterThan(0);
      expect(excavChunks.some(c => c.category === 'excavation')).toBe(true);
    });

    it('indexes Literature and Traditional Music Archive (ITMA) repertoires', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.literaryAndMusic?.literaryReferences.some(l => l.author === 'James Joyce' && l.workTitle === 'Finnegans Wake')).toBe(true);
      expect(lucan?.literaryAndMusic?.traditionalMusic?.some(t => t.tuneTitle.includes('Strawberry Beds'))).toBe(true);

      const leixlip = spatialRagService.getAreaByName('Leixlip');
      expect(leixlip?.literaryAndMusic?.traditionalMusic?.some(t => t.tuneTitle === 'The Salmon Leap')).toBe(true);

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.literaryAndMusic?.literaryReferences.some(l => l.author.includes('Edward FitzGerald'))).toBe(true);

      // Test RAG retrieval for music
      const lucanCoord = { lat: 53.3575, lng: -6.4485 };
      const litChunks = spatialRagService.retrieveCorridorChunks(lucanCoord, 'James Joyce Finnegans Wake Strawberry Beds reel');
      expect(litChunks.length).toBeGreaterThan(0);
      expect(litChunks.some(c => c.category === 'literature')).toBe(true);
    });

    it('indexes Met Éireann historical climate extremes and local sporting heritage', () => {
      const lucan = spatialRagService.getAreaByName('Lucan');
      expect(lucan?.climateAndSport?.climateEvent?.name).toContain('Great Frost');
      expect(lucan?.climateAndSport?.equineAndGaa?.gaaTradition).toContain('Lucan Sarsfields');

      const maynooth = spatialRagService.getAreaByName('Maynooth');
      expect(maynooth?.climateAndSport?.climateEvent?.name).toContain('Night of the Big Wind');
      expect(maynooth?.climateAndSport?.climateEvent?.year).toContain('1839');

      // Test RAG retrieval for climate
      const maynoothCoord = { lat: 53.3813, lng: -6.5918 };
      const climateChunks = spatialRagService.retrieveCorridorChunks(maynoothCoord, 'Night of the Big Wind 1839 hurricane storm');
      expect(climateChunks.length).toBeGreaterThan(0);
      expect(climateChunks.some(c => c.category === 'climate')).toBe(true);
    });
  });
});

