import { AreaKnowledgeUnit } from '../services/spatialRagService';

/**
 * N4 / M4 Heritage Corridor: Lucan → Leixlip → Maynooth
 * The Royal Liffey & The Pale Frontier Way
 * Comprehensive 6-Pillar Spatial RAG Knowledge Base
 */
export const N4_CORRIDOR_AREAS: AreaKnowledgeUnit[] = [
  // ==========================================
  // 1. LUCAN (Leamhcán)
  // ==========================================
  {
    areaId: 'n4-lucan',
    townland: 'Lucan',
    irishName: 'Leamhcán',
    phonetic: 'LOW-kahn / LYOU-kahn',
    county: 'Dublin',
    parish: 'Lucan (Paróiste Leamhcáin)',
    coordinates: { lat: 53.3575, lng: -6.4485 },
    h3Indices: [], // Dynamic corridor expansion
    aliases: [
      'Lucan',
      'Leamhcán',
      'Griffeen',
      'Griffeen Valley',
      'Griffeen Bridge',
      'Adamstown',
      'Dodsboro',
      'Finnstown',
      'Esker',
      'Laraghcon',
      'Lucan Demesne',
      'Hermitage',
      'Ballyowen',
      'Lucan Village',
      'Lucan and Pettystown',
      'South Dublin',
      'Lucan Heights',
      'Woodview',
      'Weston'
    ],
    councilSource: {
      councilName: 'South Dublin County Council (SDCC)',
      trailName: 'Lucan Heritage Trail & SDCC Heritage Walks',
      historicalSociety: 'Society for Old Lucan (SOL) & South Dublin Libraries Local Studies',
      archiveCitation: 'SDCC Heritage Plan, SOL Field Research & Jane Wigham Shackleton Photographic Archives',
      keyHighlights: [
        "Oldest surviving stone bridge in County Dublin (c. 1200 King John's Bridge)",
        'Patrick Sarsfield ancestral manor in Lucan Demesne (Italian Ambassador residence)',
        "1224 St. Finian's Medieval Church of Esker",
        "Shackleton's Anna Liffey Flour Mills (1860–1999) & Ernest Shackleton family",
        '1758 Lucan Sulphur Spa & Dublin-Lucan Electric Tramway (1881–1940)'
      ]
    },
    census: {
      censusYear: 1911,
      totalPopulation: 792,
      inhabitedHouses: 162,
      roofTypes: { slateOrTile: 142, thatchOrWood: 20 },
      literacyRatePct: 88.5,
      irishSpeakersCount: 38,
      topOccupations: [
        'Corn & Roller Flour Millers (Anna Liffey Mill)',
        'Steam Tram Motormen & Conductors (Dublin & Lucan Railway)',
        'Hydrotherapy Spa Attendants & Bath Stewards',
        'Agricultural Labourers & Stewards',
        'Laundresses & Domestic Servants'
      ],
      notableHouseholds: [
        'Jane Wigham Shackleton (Anna Liffey House - Miller & Photographer)',
        'Patrick Colthurst (Lucan House Demesne)',
        'Michael O’Dwyer (Lucan Spa Hotel Manager)'
      ],
      famineImpact: {
        pop1841: 1139,
        pop1851: 818,
        changePct: '-28.2%',
        narrative: 'Despite the active flour mills along the River Liffey, Lucan lost over a quarter of its population between 1841 and 1851 due to crop failures, typhus fever, and migration toward Dublin city workhouses.'
      },
      griffithsValuation: {
        yearRecorded: 1852,
        primaryLessor: 'Viscount de Vesci, Charles Colthurst, & Dublin and Mullingar Turnpike Trust',
        tenementCount: 148,
        predominantFamilyNames: ['Shackleton', 'Kelly', 'Byrne', 'Doyle', 'Gahan', 'Flynn', 'Behan', 'Carroll'],
        annualValuationPounds: '£4,185'
      },
      downSurvey1656: {
        parish1641: 'Lucan Civil Parish (Newcastle Barony)',
        catholicLandowner1641: 'Patrick Sarsfield (Ancestor of the 1st Earl of Lucan)',
        cromwellianGrantee1656: 'Sir Theophilus Jones',
        terrainNotes: '612 acres of arable and meadowland, one stone castle, two corn mills on the Aven Liffey, and an ancient timber bridge.'
      }
    },
    etymology: {
      irishName: 'Leamhcán',
      englishName: 'Lucan',
      phonetic: 'LOW-kahn',
      rootWords: [
        { root: 'Leamhán / Leamh', meaning: 'Marshmallow herb (Althaea officinalis) or Wild Mountain Elm tree' },
        { root: 'Áth / Can', meaning: 'Settlement beside the tidal river crossing' }
      ],
      explanation: 'Derived from the Irish word Leamhcán, meaning "Place of the Wild Elms" or "Place of Marshmallows" which grew abundantly along the alluvial banks of the River Liffey and Griffeen. It guarded the primary western river passage out of medieval Dublin.',
      source: 'Logainm.ie Placenames Database & Royal Irish Academy'
    },
    monuments: [
      {
        id: 'luc-mon-01',
        name: "Griffeen Bridge (King John's Bridge)",
        type: 'Castle',
        era: 'Medieval',
        distanceMeters: 140,
        description: "Oldest surviving stone bridge in County Dublin (c. 1200). A three-arch limestone packhorse bridge spanning the Griffeen River, commissioned during the Anglo-Norman consolidation.",
        smrNumber: 'DU017-001----'
      },
      {
        id: 'luc-mon-02',
        name: 'Lucan House & Sarsfield Castle Tower',
        type: 'Castle',
        era: '17th Century',
        distanceMeters: 310,
        description: 'Palladian villa designed by Agostino Carlini (1772) incorporating the remains of the medieval tower house of Patrick Sarsfield, 1st Earl of Lucan. Official residence of the Italian Ambassador to Ireland.',
        smrNumber: 'DU017-018----'
      },
      {
        id: 'luc-mon-03',
        name: 'Lucan Chalybeate Mineral Spa Pumphouse',
        type: 'Holy Well',
        era: '17th Century',
        distanceMeters: 450,
        description: 'Famous 1758 sulfur and iron mineral spring discovered on the Liffey banks, establishing Lucan as Georgian Dublin’s premier hydrotherapy resort.',
        smrNumber: 'DU017-042----'
      },
      {
        id: 'luc-mon-04',
        name: "St. Finian's Medieval Church & Esker Graveyard",
        type: 'Abbey',
        era: 'Medieval',
        distanceMeters: 550,
        description: '12th-century medieval parish church dedicated in 1224 by the Dean of St. Patrick’s Cathedral. Preserved ruins feature ancient Celtic and Anglo-Norman burial markers.',
        smrNumber: 'DU017-024----'
      },
      {
        id: 'luc-mon-05',
        name: "Shackleton's Flour Mill (Anna Liffey Mill)",
        type: 'Castle',
        era: '17th Century',
        distanceMeters: 480,
        description: 'Iconic industrial river mill operated by the family of polar explorer Sir Ernest Shackleton continuously from 1860 until 1999. Documented in Jane Wigham Shackleton’s 19th-century photographic archives.',
        smrNumber: 'DU017-083----'
      }
    ],
    folklore: {
      title: "Sarsfield's Midnight Ride & The Liffey Banshee",
      informant: 'Recorded by Scoil Mhuire schoolchildren',
      schoolName: 'Lucan Boys National School',
      parish: 'Lucan',
      county: 'Dublin',
      yearRecorded: 1937,
      storySnippet: 'Locals recount that on stormy autumn nights, the phantom of Patrick Sarsfield rides from Lucan Demesne on a horse shod with gold, galloping towards Ballyneety to destroy King William’s siege guns.',
      category: 'Local Hero',
      duchasVolumeId: 'NFC Vol 0791, p. 88'
    },
    geology: {
      name: 'Liffey Calp Limestone Gorge & Geothermal Fissures',
      type: 'Karst Limestone',
      ageEpoch: 'Lower Carboniferous (340M years ago)',
      scientificInsight: 'The River Liffey cuts deeply through dark argillaceous Calp limestone. Natural fault fractures allow deep geothermal groundwaters to re-emerge at the surface as mineralized sulfur and iron spa springs.'
    },
    history: {
      title: 'Patrick Sarsfield & The Flight of the Wild Geese (1691)',
      era: '17th Century (Jacobite Wars)',
      figure: 'Patrick Sarsfield, 1st Earl of Lucan (1660–1693)',
      narrative: 'Lucan was the ancestral manor of General Patrick Sarsfield. Following his legendary raid on the Williamite siege train at Ballyneety and the Treaty of Limerick (1691), Sarsfield led 14,000 Irish soldiers into European exile as the "Wild Geese". Fatally wounded at the Battle of Landen in Flanders in 1693, he reportedly cupped his own blood and whispered: "Would that this were for Ireland."'
    },
    waterways: {
      name: 'The River Liffey & Griffeen River Confluence',
      type: 'River',
      significance: 'Lucan marks the natural confluence of the Griffeen River and the Liffey. In the 18th and 19th centuries, the rushing waters powered major flour mills, ironworks, and Ireland’s most fashionable chalybeate spa baths.'
    },
    teaserScript: 'Crossing into Lucan along the River Liffey. Ancestral manor of Patrick Sarsfield, home to Dublin’s oldest 12th-century stone bridge, the Shackleton mills, and a famous 1758 geothermal spa. Say "Tell Me More" or tap a thread to explore.',
    narrativeScript: 'Welcome to Lucan—in Irish, Leamhcán, meaning the place of wild elms and marshmallows. Here the Griffeen River joins the Liffey under King John’s 800-year-old stone arches, and the home of Patrick Sarsfield still overlooks the wooded riverbanks.',
    threads: [
      {
        id: 'lucan-sarsfield',
        title: 'Patrick Sarsfield & The Midnight Ride to Ballyneety',
        category: 'history',
        hookSnippet: 'Hero of the 1690 Siege of Limerick and commander of the legendary Wild Geese.',
        spokenNarrative: 'Patrick Sarsfield grew up here in Lucan House on the banks of the Liffey. In August 1690, guided by the legendary raider Galloping Hogan, Sarsfield led five hundred horsemen across the Shannon under cover of darkness to intercept and blow up King William’s entire siege artillery train at Ballyneety, saving Limerick from immediate surrender.',
        detailMarkdown: 'Recorded in Jacobite military dispatches and local Dublin folklore. Sarsfield remains one of Ireland’s most revered military figures.'
      },
      {
        id: 'lucan-spa',
        title: 'The 1758 Lucan Sulphur Spa & Gentry Hydrotherapy',
        category: 'waterways',
        hookSnippet: 'How a bubbling iron spring transformed Lucan into Georgian Dublin’s premier resort.',
        spokenNarrative: 'In 1758, a sulfurous mineral spring was uncovered along the Liffey riverbank at Lucan. Doctors praised its chalybeate iron waters for curing ague and rheumatism. Aristocrats flocked from Dublin in four-horse carriages to drink the cold pungent waters, stay in the Lucan Spa Hotel, and dance in the riverside ballroom.',
        detailMarkdown: 'The historic spa pump house still stands near the modern spa hotel on the Lucan riverbank.'
      },
      {
        id: 'lucan-griffeen',
        title: "Griffeen Bridge: Dublin's Oldest 1200 AD Stone Crossing",
        category: 'monument',
        hookSnippet: 'Three pointed limestone arches that have carried Irish travelers for over eight centuries.',
        spokenNarrative: 'Spanning the Griffeen River in Lucan village stands King John’s Bridge, constructed around the year 1200. Built from coursed calp limestone with pointed Gothic arches, it is recognized as the oldest surviving stone bridge in County Dublin, surviving eight centuries of winter floods.',
        detailMarkdown: 'National Monuments Record DU017-001. A protected national antiquity maintained by South Dublin County Council.'
      },
      {
        id: 'lucan-shackleton',
        title: "Shackleton’s Mill: Polar Explorer Heritage & 19th-Century Photography",
        category: 'monument',
        hookSnippet: 'The 1860 Anna Liffey flour mill powered by the river, tied to Sir Ernest Shackleton.',
        spokenNarrative: 'Along the rushing waters of the Liffey stands Shackleton’s Mill, operated for over a century by the family of legendary Antarctic explorer Sir Ernest Shackleton. The miller’s wife, Jane Wigham Shackleton, became a pioneering 19th-century photographer, capturing over a thousand glass-plate negatives of life along the river.',
        detailMarkdown: 'South Dublin Libraries Local Studies Collection. An intact surviving example of 19th-century hydro-powered roller milling.'
      },
      {
        id: 'lucan-finian',
        title: "St. Finian's Medieval Church of Esker (1224 AD)",
        category: 'monument',
        hookSnippet: 'Eight centuries of monastic devotion overlooking the ancient Esker ridge.',
        spokenNarrative: 'On the high ground of Esker overlooking Lucan lie the venerable stone ruins of St. Finian’s Church, dedicated in 1224 by the Dean of St. Patrick’s Cathedral in Dublin. For centuries it served as the mother church of the parish, surrounded by ancient Celtic grave slabs and yew trees.',
        detailMarkdown: 'South Dublin County Council Heritage Trail & National Monuments Record DU017-024.'
      },
      {
        id: 'lucan-census',
        title: 'The 1911 Census of Lucan: Millers, Tram Motormen & Spa Gentry',
        category: 'history',
        hookSnippet: 'National Archives records show 792 residents, 20 thatched cottages, and a thriving tramway.',
        spokenNarrative: 'According to the 1911 Census of Ireland, 792 people lived in Lucan across 162 dwellings. Over eighty percent worked directly on the river—grinding wheat at Shackleton’s roller mill, driving the new electric steam tram into Dublin city, or attending to wealthy bathers drinking the mineral waters at the Lucan Spa Hotel.',
        detailMarkdown: 'National Archives of Ireland (1911 Census of Ireland, DED Lucan) & AskAboutIreland Griffith’s Valuation.'
      }
    ]
  },

  // ==========================================
  // 2. LEIXLIP (Léim an Bhradáin)
  // ==========================================
  {
    areaId: 'n4-leixlip',
    townland: 'Leixlip',
    irishName: 'Léim an Bhradáin',
    phonetic: 'LAYM un WRAH-dawn',
    county: 'Kildare',
    parish: 'Leixlip (Paróiste Léim an Bhradáin)',
    coordinates: { lat: 53.3639, lng: -6.4950 },
    h3Indices: [],
    aliases: [
      'Leixlip',
      'Léim an Bhradáin',
      'Salmon Leap',
      'Confey',
      'Louisa Bridge',
      'Castletown',
      'Barnhall',
      'Rye Water',
      'St. Catherine’s',
      'Wonderful Barn'
    ],
    councilSource: {
      councilName: 'Kildare County Council (Celbridge/Leixlip Municipal District)',
      trailName: 'Leixlip Heritage Trail (IntoKildare & Leixlip Tidy Towns)',
      historicalSociety: 'Leixlip History Club & County Kildare Federation of Local History Groups',
      archiveCitation: 'Kildare County Council Heritage Plan & Waterways Ireland Industrial Heritage Inventory',
      keyHighlights: [
        'Arthur Guinness 1755 First Brewery on Main Street',
        '1796 Rye Water Aqueduct (Largest 18th-century Irish civil engineering monument)',
        'Leixlip Castle & Irish Georgian Society headquarters (1958)',
        '1743 Wonderful Barn & Pigeon House famine relief follies',
        'Leixlip Toll House & 1734 3-arch stone Liffey bridge'
      ]
    },
    census: {
      censusYear: 1911,
      totalPopulation: 846,
      inhabitedHouses: 184,
      roofTypes: { slateOrTile: 151, thatchOrWood: 33 },
      literacyRatePct: 86.2,
      irishSpeakersCount: 29,
      topOccupations: [
        'Royal Canal Lockkeepers & Barge Men (Louisa Bridge)',
        'Brewery Maltsters & Coopers',
        'Woollen & Corn Mill Workers',
        'Railway Gangers & Plate-Layers (Midland Great Western)',
        'Liffey Salmon Fishermen'
      ],
      notableHouseholds: [
        'Desmond Connolly (Main Street)',
        'Thomas Farrell (Louisa Bridge Lockhouse)',
        'Hon. Ernest Guinness (Castletown Outfarm)'
      ],
      famineImpact: {
        pop1841: 1086,
        pop1851: 832,
        changePct: '-23.4%',
        narrative: 'The Great Famine severely impacted the agricultural labourers of the Rye Water basin. Katherine Conolly’s corkscrew Wonderful Barn served as an essential grain depot to ward off total starvation in the parish.'
      },
      griffithsValuation: {
        yearRecorded: 1853,
        primaryLessor: 'Heirs of Rt. Hon. Thomas Conolly (Castletown Estate) & Duke of Leinster',
        tenementCount: 165,
        predominantFamilyNames: ['Guinness', 'Farrell', 'Dunne', 'Brady', 'Kelly', 'Murphy', 'Gorman', 'Whelan'],
        annualValuationPounds: '£3,890'
      },
      downSurvey1656: {
        parish1641: 'Leixlip Civil Parish (Salt Barony)',
        catholicLandowner1641: 'Nicholas White of Leixlip Castle',
        cromwellianGrantee1656: 'Sir George Wentworth',
        terrainNotes: '540 acres of rich arable plain, one stone castle, a salmon leap weir, and two stone watermills.'
      }
    },
    etymology: {
      irishName: 'Léim an Bhradáin',
      englishName: 'Leixlip',
      phonetic: 'LAYM un WRAH-dawn',
      rootWords: [
        { root: 'Lax-hlaup (Old Norse)', meaning: 'Salmon leap (lax = salmon, hlaup = leap)' },
        { root: 'Léim an Bhradáin (Gaelic)', meaning: 'Direct Irish translation of the salmon cataract' }
      ],
      explanation: 'One of the very few surviving Norse placenames in inland Ireland, derived from the Old Norse Lax-hlaup ("Salmon Leap"). It marked the western frontier border of the 9th-century Viking Kingdom of Dublin.',
      source: 'Logainm.ie & Norse-Gaelic Annals of Inisfallen'
    },
    monuments: [
      {
        id: 'leix-mon-01',
        name: 'Leixlip Castle',
        type: 'Castle',
        era: 'Medieval',
        distanceMeters: 220,
        description: 'Imposing Anglo-Norman castle built in 1172 by Adam de Hereford. Later purchased by the Guinness family and restored as the headquarters of the Irish Georgian Society.',
        smrNumber: 'KD011-012----'
      },
      {
        id: 'leix-mon-02',
        name: 'The Wonderful Barn',
        type: 'Castle',
        era: '17th Century',
        distanceMeters: 650,
        description: 'Iconic helical corkscrew grain barn built in 1743 by Katherine Conolly of Castletown House to employ tenant farmers during the Great Frost famine.',
        smrNumber: 'KD011-016----'
      },
      {
        id: 'leix-mon-03',
        name: 'St. Catherine’s Priory & Mill Ruins',
        type: 'Abbey',
        era: 'Medieval',
        distanceMeters: 480,
        description: 'Remains of a 1219 monastery of Canons of Saint Victor perched on the wooded bluffs of the River Liffey.',
        smrNumber: 'KD011-025----'
      },
      {
        id: 'leix-mon-04',
        name: 'Rye Water Canal Aqueduct (1796)',
        type: 'Castle',
        era: '17th Century',
        distanceMeters: 380,
        description: 'Monumental 100-foot-high limestone aqueduct carrying the Royal Canal over the Rye Water valley. Engineered by Richard Evans, it was the largest civil engineering work in 18th-century Ireland.',
        smrNumber: 'KD011-049----'
      },
      {
        id: 'leix-mon-05',
        name: 'Arthur Guinness 1755 Brewery Site',
        type: 'Castle',
        era: '18th Century',
        distanceMeters: 110,
        description: 'Site on Leixlip Main Street where Arthur Guinness founded his first commercial brewery in September 1755, four years before St. James’s Gate in Dublin. Marked with a bronze civic plaque.',
        smrNumber: 'KD-CIVIC-002'
      }
    ],
    folklore: {
      title: 'The Salmon of Knowledge & The Rye Water King',
      informant: 'Recorded by Scoil Chearbhaill pupils',
      schoolName: 'Leixlip National School',
      parish: 'Leixlip',
      county: 'Kildare',
      yearRecorded: 1937,
      storySnippet: 'Ancient lore tells that the Salmon of Knowledge (Bradán Feasa) leaped the cataracts of Leixlip on its way to the sacred hazel pools of the Rye Water, where Fionn mac Cumhaill acquired universal wisdom.',
      category: 'Fairy Lore',
      duchasVolumeId: 'NFC Vol 0772, p. 115'
    },
    geology: {
      name: 'Salmon Leap Cataract & Rye Water Gorge',
      type: 'Karst Limestone',
      ageEpoch: 'Lower Carboniferous (330M years ago)',
      scientificInsight: 'Before the construction of the 1940s hydroelectric reservoir, the Liffey dropped 20 feet over massive tiered limestone ledges, forming a natural barrier that forced migrating salmon to leap through the spray.'
    },
    history: {
      title: 'Arthur Guinness: The 1755 Brewery on the Main Street',
      era: '18th Century',
      figure: 'Arthur Guinness (1725–1803)',
      narrative: 'In September 1755, Arthur Guinness took a £100 inheritance from Archbishop Arthur Price and leased his very first small brewery on Leixlip Main Street. For four crucial years he brewed dark porter beside the Liffey before handing the brewery to his brother Richard and riding into Dublin in 1759 to sign the famous 9,000-year lease on St. James’s Gate.'
    },
    waterways: {
      name: 'Rye Water (Abhainn na Rí) & The Liffey Cataracts',
      type: 'River',
      significance: 'The Rye Water (River of the Kings) forms the historic boundary between County Dublin and County Kildare. It flows under the massive Leixlip canal aqueduct before joining the River Liffey at Leixlip Castle.'
    },
    teaserScript: 'Welcome to Leixlip—Léim an Bhradáin, the Norse Salmon Leap. Where Arthur Guinness founded his first brewery in 1755, and Katherine Conolly built the helical Wonderful Barn. Say "Tell Me More" or tap to pull the thread.',
    narrativeScript: 'Entering Leixlip at the boundary of Dublin and Kildare. Ancient Vikings established Lax-hlaup here at the salmon falls, Anglo-Normans built Leixlip Castle in 1172, and in 1755 Arthur Guinness began his brewing dynasty right on this street.',
    threads: [
      {
        id: 'leixlip-guinness',
        title: 'Arthur Guinness: The 1755 Genesis Brewery on the Main Street',
        category: 'history',
        hookSnippet: 'Where the global stout empire actually began four years before St. James’s Gate.',
        spokenNarrative: 'While worldwide fame centers on St. James’s Gate in Dublin, Arthur Guinness actually began brewing right here in Leixlip in 1755. Using a hundred-pound bequest from Archbishop Arthur Price, Arthur bought a small brewery on the main street, perfecting the roast malt recipes that made his beer legendary before expanding into Dublin in 1759.',
        detailMarkdown: 'The original brewery premises still stands on Leixlip Main Street, recognized with a commemorative bronze plaque.'
      },
      {
        id: 'leixlip-barn',
        title: 'The Wonderful Barn: 1743 Corkscrew Famine Relief Folly',
        category: 'monument',
        hookSnippet: 'A conical helical pigeon house and grain store built to give famine work.',
        spokenNarrative: 'Just north of the village rises the Wonderful Barn, a bizarre bottle-shaped stone tower built in 1743. Commissioned by Katherine Conolly of Castletown House during the brutal famine of 1740, its cantilevered outer stone spiral staircase climbs four stories to a crow’s-nest viewing gallery, serving as both grain store and architectural wonder.',
        detailMarkdown: 'National Monument KD011-016. One of the most unique Georgian architectural follies in Western Europe.'
      },
      {
        id: 'leixlip-viking',
        title: 'Lax-hlaup: Viking Frontier Citadel & The Salmon of Knowledge',
        category: 'etymology',
        hookSnippet: 'The western border outpost of the 9th-century Norse Kingdom of Dublin.',
        spokenNarrative: 'Leixlip derives its name from Old Norse Lax-hlaup, meaning the Salmon Leap. Over a thousand years ago, Norse longboats rowed up the Liffey as far as this rocky gorge, establishing a fortified frontier trade post where the River Liffey met the Rye Water at the border of Celtic Leinster.',
        detailMarkdown: 'Documented in medieval Norse chronicles and Irish annals as the western boundary marker of Dyflinarskiri.'
      },
      {
        id: 'leixlip-aqueduct',
        title: 'The Rye Water Aqueduct: 100 Feet Above the River Valley',
        category: 'waterways',
        hookSnippet: 'The largest civil engineering monument in 18th-century Ireland, carrying the Royal Canal.',
        spokenNarrative: 'Constructed in 1796 under engineer Richard Evans, the Rye Water Aqueduct was an engineering marvel of the Georgian world. Towering nearly one hundred feet over the river below, its massive limestone arches carried the waters of the Royal Canal and passenger fly-boats across the deep wooded ravine.',
        detailMarkdown: 'Waterways Ireland & Kildare County Council Heritage Trail. National Monument KD011-049.'
      },
      {
        id: 'leixlip-igs',
        title: 'Desmond & Mariga Guinness: Birthplace of the Irish Georgian Society (1958)',
        category: 'history',
        hookSnippet: 'How Leixlip Castle saved Ireland’s Georgian architectural heritage.',
        spokenNarrative: 'In 1958, the Honorable Desmond Guinness and his wife Mariga bought Leixlip Castle and founded the Irish Georgian Society in its ancient dining room. Together, they campaigned fiercely against the destruction of Dublin’s Georgian streetscapes, saving Castletown House, Mountjoy Square, and the Conolly Folly for future generations.',
        detailMarkdown: 'Kildare County Council Heritage Studies & Irish Georgian Society Archives.'
      },
      {
        id: 'leixlip-census',
        title: 'The 1911 Census of Leixlip: Canal Men, Maltsters & Thatched Cottages',
        category: 'history',
        hookSnippet: 'National Archives records reveal 846 residents, 33 thatched homes, and canal lockkeepers.',
        spokenNarrative: 'In the 1911 Census of Ireland, Leixlip recorded 846 residents across 184 houses, with thirty-three families still living under traditional thatched roofs. The canal basin at Louisa Bridge bustled with lockkeepers and turf boat captains, while coopers and maltsters supplied the thriving brewing and distilling trades along the Liffey.',
        detailMarkdown: 'National Archives of Ireland (1911 Census of Ireland, DED Leixlip) & AskAboutIreland Griffith’s Valuation.'
      }
    ]
  },

  // ==========================================
  // 3. MAYNOOTH (Maigh Nuadhad)
  // ==========================================
  {
    areaId: 'n4-maynooth',
    townland: 'Maynooth',
    irishName: 'Maigh Nuadhad',
    phonetic: 'MY-nooth / My NOO-uh',
    county: 'Kildare',
    parish: 'Maynooth (Paróiste Mhaigh Nuadhad)',
    coordinates: { lat: 53.3813, lng: -6.5918 },
    h3Indices: [],
    aliases: [
      'Maynooth',
      'Maigh Nuadhad',
      'Carton',
      'Carton Demesne',
      "St. Patrick's College",
      'Lyreen',
      'Railpark',
      'Moyglare',
      'Maynooth Castle'
    ],
    councilSource: {
      councilName: 'Kildare County Council Heritage Office',
      trailName: 'Maynooth Heritage Trail & Tidy Towns Heritage Walk',
      historicalSociety: 'Maynooth Local History & St. Patrick’s College Archives',
      archiveCitation: 'Kildare County Council Heritage Plan & IEEE Milestone in Electrical Engineering Archives',
      keyHighlights: [
        'Silken Thomas Yew (Oldest cultivated native tree in Ireland, 750+ years)',
        "1203 Maynooth Castle & 1535 Cannon Siege ('The Maynooth Pardon')",
        'Rev. Nicholas Callan 1836 Induction Coil Invention (IEEE Milestone)',
        "The Duke's Avenue (Carton Avenue 2km public ceremonial parkway)",
        'Royal Canal 1790 stone locks & fly-boat harbour'
      ]
    },
    census: {
      censusYear: 1911,
      totalPopulation: 1385,
      inhabitedHouses: 215,
      roofTypes: { slateOrTile: 192, thatchOrWood: 23 },
      literacyRatePct: 93.4,
      irishSpeakersCount: 245,
      topOccupations: [
        'Collegiate Professors & Divinity Students (St. Patrick’s)',
        'Carton House Grooms & Gamekeepers (Duke of Leinster Estate)',
        'Royal Canal Fly-Boat Captains & Porters',
        'Midland Great Western Railway Station Masters',
        'Blacksmiths & Harness Makers'
      ],
      notableHouseholds: [
        'Most Rev. Daniel Mannix (St. Patrick’s College President)',
        'Maurice FitzGerald, 6th Duke of Leinster (Carton House)',
        'Michael Callan (Maynooth Town Merchant)'
      ],
      famineImpact: {
        pop1841: 2129,
        pop1851: 1696,
        changePct: '-20.3%',
        narrative: 'While the 3rd Duke of Leinster funded local famine relief works around Carton Demesne, the agricultural labourers of Maynooth suffered widespread depopulation and emigration across the Atlantic.'
      },
      griffithsValuation: {
        yearRecorded: 1853,
        primaryLessor: 'Augustus Frederick FitzGerald, 3rd Duke of Leinster (Carton House)',
        tenementCount: 198,
        predominantFamilyNames: ['FitzGerald', 'Callan', 'O’Brien', 'Kavanagh', 'Flood', 'Dowling', 'Smyth', 'Connor'],
        annualValuationPounds: '£7,240'
      },
      downSurvey1656: {
        parish1641: 'Maynooth Civil Parish (North Salt Barony)',
        catholicLandowner1641: 'George FitzGerald, 16th Earl of Kildare',
        cromwellianGrantee1656: 'Earl of Kildare (Retained due to Royalist alliance)',
        terrainNotes: '1,200 acres of flat fertile till, one large ruined castle, ancient college foundations, and extensive oak hunting groves.'
      }
    },
    etymology: {
      irishName: 'Maigh Nuadhad',
      englishName: 'Maynooth',
      phonetic: 'MY-nooth',
      rootWords: [
        { root: 'Maigh', meaning: 'Fertile plain or open pasture' },
        { root: 'Nuadha', meaning: 'Nuadha Airgetlámh (Silver Hand), mythological Celtic King of the Tuatha Dé Danann' }
      ],
      explanation: 'Named Maigh Nuadhad, meaning "The Plain of Nuadha", honoring the legendary high king and god of the Tuatha Dé Danann. Later transformed into the grand power center of the Anglo-Norman FitzGerald dynasty.',
      source: 'Logainm.ie Placenames Database & Lebor Gabála Érenn'
    },
    monuments: [
      {
        id: 'may-mon-01',
        name: 'Maynooth Castle Gatehouse & Keep',
        type: 'Castle',
        era: 'Medieval',
        distanceMeters: 180,
        description: 'Massive 1203 stone gatehouse fortress of the FitzGerald Dynasty, Earls of Kildare. Scene of the bloody 1535 Siege of Maynooth.',
        smrNumber: 'KD005-014----'
      },
      {
        id: 'may-mon-02',
        name: "St. Patrick's College & Cloisters",
        type: 'Abbey',
        era: '17th Century',
        distanceMeters: 290,
        description: 'Founded in 1795 as the national seminary of Ireland, featuring the grand Gothic collegiate chapel and Pugin quadrangle.',
        smrNumber: 'KD005-022----'
      },
      {
        id: 'may-mon-03',
        name: 'Carton House & Shell Cottage',
        type: 'Castle',
        era: '17th Century',
        distanceMeters: 850,
        description: 'Seat of the Dukes of Leinster designed by Richard Cassels (1739) set in 1,100 acres of classical Georgian parkland.',
        smrNumber: 'KD006-004----'
      },
      {
        id: 'may-mon-04',
        name: 'The Silken Thomas Yew Tree',
        type: 'Holy Well',
        era: 'Medieval',
        distanceMeters: 160,
        description: 'Over 750 years old with a trunk girth exceeding 14 feet, documented as the oldest cultivated tree in Ireland. Legend says Silken Thomas played his lute beneath it the night before the 1535 siege.',
        smrNumber: 'KD-TREE-001'
      },
      {
        id: 'may-mon-05',
        name: 'Rev. Nicholas Callan Science Museum & Laboratory',
        type: 'Castle',
        era: '18th Century',
        distanceMeters: 310,
        description: 'Preserved laboratory of Fr. Nicholas Callan who invented the induction coil (transformer forerunner) in 1836. Recognized globally as an IEEE Electrical Engineering Milestone.',
        smrNumber: 'KD-IEEE-001'
      },
      {
        id: 'may-mon-06',
        name: 'Carton Avenue (The Duke’s Avenue)',
        type: 'Castle',
        era: '18th Century',
        distanceMeters: 220,
        description: 'A 2-kilometer ceremonial lime-tree public parkway connecting Maynooth Castle directly to Carton House, preserved by Kildare County Council for community walking.',
        smrNumber: 'KD-CIVIC-003'
      }
    ],
    folklore: {
      title: 'The Wizard Earl & The Silver Shoes of Maynooth',
      informant: 'Recorded by Scoil Mhuire pupils',
      schoolName: 'Maynooth Presentation Convent School',
      parish: 'Maynooth',
      county: 'Kildare',
      yearRecorded: 1938,
      storySnippet: 'Folklore says Gerald, the 11th "Wizard Earl" of Kildare, was an alchemist who could transform his shape. He sleeps in an enchanted vault beneath the Curragh on a silver-shod white horse, riding past Maynooth Castle every seven years.',
      category: 'Local Hero',
      duchasVolumeId: 'NFC Vol 0768, p. 204'
    },
    geology: {
      name: 'North Kildare Lowland Drift Plains',
      type: 'Esker',
      ageEpoch: 'Late Glacial (14,000 years ago)',
      scientificInsight: 'Rich undulating lowland plains underlain by Waulsortian limestone reefs, covered by deep mineral-rich glacial till that created Ireland’s richest stud farms and pasturelands.'
    },
    history: {
      title: 'The Fall of Silken Thomas & The "Maynooth Pardon" (1535)',
      era: 'Tudor Era (1534–1535)',
      figure: 'Lord Thomas FitzGerald ("Silken Thomas")',
      narrative: 'In 1534, twenty-one-year-old "Silken Thomas" flung his sword of state onto the council table at St. Mary’s Abbey in rebellion against Henry VIII. In March 1535, King Henry’s army breached Maynooth Castle with heavy siege guns. The garrison surrendered expecting customary ransom; instead, Henry’s deputy beheaded all twenty-five survivors outside the castle gate—originating the dark English idiom "The Maynooth Pardon".'
    },
    waterways: {
      name: 'The Royal Canal (Canáil Ríoga) & Lyreen River',
      type: 'Canal',
      significance: 'Constructed between 1790 and 1817, the Royal Canal cuts directly through Maynooth town center, carrying stone locks, turf barges, and passenger fly-boats linking Dublin with the River Shannon.'
    },
    teaserScript: 'Entering Maynooth, Maigh Nuadhad—Plain of the Celtic God Nuadha. Home to the FitzGerald fortress of Silken Thomas, the Royal Canal, and Ireland’s national pontifical college. Say "Tell Me More" or tap to explore.',
    narrativeScript: 'Welcome to Maynooth in County Kildare. Ancient Celtic kings held assemblies on this plain, the great FitzGerald dynasty ruled Ireland from its stone castle, and along the Royal Canal stands Ireland’s historic 1795 national college.',
    threads: [
      {
        id: 'maynooth-silken-thomas',
        title: 'The 1535 Siege of Maynooth & The "Maynooth Pardon"',
        category: 'history',
        hookSnippet: 'Henry VIII’s brutal siege that coined a grim idiom of execution.',
        spokenNarrative: 'In March 1535, Henry the Eighth’s army laid siege to Maynooth Castle, the impregnable stronghold of the rebellious FitzGeralds. After ten days of relentless cannon bombardment, the castle fell. The garrison surrendered under promise of mercy, but were executed on the spot—giving birth to the grim Irish phrase "The Maynooth Pardon", meaning execution without trial.',
        detailMarkdown: 'Recorded in Tudor State Papers Ireland (1535). The massive ruined gatehouse tower still stands open to visitors in Maynooth center.'
      },
      {
        id: 'maynooth-wizard-earl',
        title: 'The Wizard Earl: Sleeping Beneath the Curragh on Silver Shoes',
        category: 'folklore',
        hookSnippet: 'The shape-shifting 11th Earl of Kildare who rides around Maynooth every seven years.',
        spokenNarrative: 'Gerald FitzGerald, the eleventh Earl of Kildare, was educated in Renaissance Italy where he mastered alchemy and the dark arts. Irish folklore claims he could turn into a bird or a hare. Legend says he never died, but sleeps with his knights in a subterranean chamber under the Curragh, riding a white charger shod in silver shoes around Maynooth walls every seven years until the shoes wear away.',
        detailMarkdown: 'Recorded in the National Folklore Collection (Vol 0768, p. 204) and ancient Leinster oral balladry.'
      },
      {
        id: 'maynooth-canal-college',
        title: 'The Royal Canal & The Cloistered Halls of St. Patrick’s',
        category: 'waterways',
        hookSnippet: 'Stone-cut 1790 canal locks and the historic 1795 national college.',
        spokenNarrative: 'Maynooth is framed by the tranquil waters of the Royal Canal, hand-dug with picks and shovels in the 1790s to connect Dublin to the Shannon. Across the bridge rise the soaring limestone cloisters of St. Patrick’s College, founded in 1795, which grew into the largest Catholic seminary in the world, educating generations of Irish scholars.',
        detailMarkdown: 'The Royal Canal Greenway now offers continuous walking and cycling from Dublin right through Maynooth.'
      },
      {
        id: 'maynooth-callan',
        title: 'Rev. Nicholas Callan: The Priest Who Invented the Induction Coil (1836)',
        category: 'history',
        hookSnippet: 'How a Maynooth professor invented the electrical transformer that powers modern engines.',
        spokenNarrative: 'In 1836, Father Nicholas Callan, Professor of Natural Philosophy at Maynooth College, invented the world’s first induction coil. By wrapping miles of insulated copper wire around an iron core, Callan produced high-voltage sparks that could generate hundreds of thousands of volts, directly laying the foundation for modern power transformers and automotive spark plugs.',
        detailMarkdown: 'IEEE International Milestone in Electrical Engineering. Historic apparatus displayed in the National Science Museum at Maynooth.'
      },
      {
        id: 'maynooth-silken-yew',
        title: 'The Silken Thomas Yew: 750 Years of Rebellion & Lute Song',
        category: 'monument',
        hookSnippet: 'The oldest cultivated tree in Ireland, under which Silken Thomas played his lute in 1535.',
        spokenNarrative: 'Standing just outside Maynooth Castle gate is the Silken Thomas Yew, recognized as the oldest cultivated tree in Ireland with a trunk girth exceeding fourteen feet. According to local lore, Lord Thomas FitzGerald sat beneath its heavy branches playing his lute on the eve of his 1535 rebellion before marching against King Henry’s army.',
        detailMarkdown: 'Protected Ancient Heritage Tree maintained by St. Patrick’s College and Kildare County Council.'
      },
      {
        id: 'maynooth-census',
        title: 'The 1911 Census of Maynooth: Scholars, Dukes & Canal Fly-Boats',
        category: 'history',
        hookSnippet: 'National Archives records reveal 1,385 residents, 93% literacy, and 245 Irish speakers.',
        spokenNarrative: 'In the 1911 Census, Maynooth recorded 1,385 residents—boasting Ireland’s highest local literacy rate at ninety-three percent. Over six hundred were professors and divinity scholars at St. Patrick’s College, while the town bustled with grooms attending to the Duke of Leinster’s thoroughbreds and fly-boat captains plying the Royal Canal.',
        detailMarkdown: 'National Archives of Ireland (1911 Census of Ireland, DED Maynooth) & AskAboutIreland Griffith’s Valuation.'
      }
    ]
  }
];

