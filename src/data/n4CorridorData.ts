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
    artReferences: [
      {
        id: 'art-luc-01',
        artist: 'William Ashford PRHA',
        artistLifespan: '1746–1824',
        artworkTitle: 'View of Lucan House and Bridge',
        yearCreated: 'c. 1795',
        medium: 'Oil on canvas',
        galleryOrCollection: 'National Gallery of Ireland (NGI)',
        catalogRef: 'NGI Collection',
        description: 'Ashford, the first President of the Royal Hibernian Academy, captures the newly completed neoclassical Lucan House villa framed by mature river elms, with the single-arch limestone Lucan Bridge spanning the reflective waters of the River Liffey.',
        culturalSignificance: 'Regarded as a defining masterpiece of 18th-century Irish topographical painting, demonstrating the harmonious relationship between Palladian domestic architecture and the pastoral Irish landscape.'
      },
      {
        id: 'art-luc-02',
        artist: 'Agostino Carlini RA',
        artistLifespan: '1718–1790',
        artworkTitle: 'Patrick Sarsfield Memorial & Neoclassical Hallway Plasterwork',
        yearCreated: '1772',
        medium: 'Carved Carrara marble & high-relief neoclassical plasterwork',
        galleryOrCollection: 'Lucan House (Parco Italia / SDCC Collection)',
        description: 'Commissioned by the Rt. Hon. Agmondisham Vesey, Italian sculptor Carlini—a founding member and keeper of the Royal Academy in London—created the classical bust and memorial to General Patrick Sarsfield, alongside delicate mythological plaster reliefs.',
        culturalSignificance: 'One of the earliest instances in Ireland of Continental neoclassical sculpture commemorating a Gaelic Jacobite hero, setting the standard for Georgian interior decoration.'
      },
      {
        id: 'art-luc-03',
        artist: 'James Arthur O’Connor',
        artistLifespan: '1792–1841',
        artworkTitle: 'The Liffey Valley near Lucan',
        yearCreated: 'c. 1828',
        medium: 'Oil on canvas',
        galleryOrCollection: 'National Gallery of Ireland (NGI)',
        catalogRef: 'NGI.652',
        description: 'A romantic depiction of the meandering Liffey Valley below Lucan weir, bathed in soft afternoon light with rustic strollers along the towpath.',
        culturalSignificance: 'Exemplifies the early 19th-century Irish Romantic movement, portraying Lucan as an idyllic escape from Dublin’s urban expansion.'
      },
      {
        id: 'art-luc-04',
        artist: 'Jane Wigham Shackleton',
        artistLifespan: '1843–1911',
        artworkTitle: 'The Shackleton Photographic Archive of Anna Liffey',
        yearCreated: '1885–1906',
        medium: 'Gelatin silver glass-plate negatives & whole-plate lantern slides',
        galleryOrCollection: 'National Library of Ireland (NLI Prints & Drawings)',
        catalogRef: 'NLI Shackleton Collection',
        description: 'Over 1,000 historic glass plates capturing daily life at Anna Liffey Flour Mills, workers loading grain sacks, horse-drawn tramcars, and spa tourism in Lucan.',
        culturalSignificance: 'A cornerstone of Irish documentary social history; Jane Wigham Shackleton was among Ireland’s earliest female documentary photographers.'
      }
    ],
    communityLinks: [
      {
        id: 'link-luc-italy',
        communityName: 'The Italian Diplomatic & Cultural Connection — Parco Italia',
        connectionEra: '1954–Present (70-Year Residency & 2024 State Handover)',
        flagEmoji: '🇮🇹',
        summary: 'From 1954 to 2024, Lucan House served as the official residence of the Italian Ambassador to Ireland. In May 2024, a historic €10.5M partnership transferred the estate to South Dublin County Council to create "Parco Italia".',
        narrative: 'For seven decades, the Italian Republic maintained Lucan House as a prestigious center of diplomacy, hospitality, and Italian-Irish cultural ties. In May 2024, Italian President Sergio Mattarella and President of Ireland Michael D. Higgins marked the landmark €10.5 million acquisition by South Dublin County Council. The 12-hectare estate and classical villa are being transformed into "Parco Italia", opening its ancient woodland walks, Palladian architecture, and Carlini stuccowork to the public for the first time in history.',
        keyFiguresOrMilestones: [
          '1954: Italian State acquires Lucan House as Ambassadorial residence',
          'May 2024: €10.5M handover to South Dublin County Council',
          'President Sergio Mattarella & President Michael D. Higgins state visit',
          'Establishment of Parco Italia public park, cultural pavilion & biodiversity sanctuary'
        ]
      },
      {
        id: 'link-luc-quaker',
        communityName: 'Quaker Transatlantic Industrial Network',
        connectionEra: '1860–1930s',
        flagEmoji: '🌾',
        summary: 'The Shackleton Quaker family connected Lucan to transatlantic milling innovations, worker welfare, and global polar exploration.',
        narrative: 'Settling along the Liffey at Anna Liffey House, the Quaker Shackleton family established progressive labor practices, pioneered mechanized roller milling, and fostered an ethos of rigorous education that shaped Antarctic explorer Sir Ernest Shackleton.',
        keyFiguresOrMilestones: [
          'Ebenezer Shackleton (Mill Founder)',
          'Jane Wigham Shackleton (Documentarian)',
          'Sir Ernest Shackleton (Polar Explorer lineage)'
        ]
      }
    ],
    csoModern: {
      censusYear: 2022,
      population2022: 57575,
      growthFrom1911Pct: '+7,169%',
      households2022: 18924,
      broadbandCoveragePct: 97.8,
      demographicProfile: 'One of Ireland’s fastest-growing, youngest (median age 35.2), and most multicultural metropolitan suburbs. Over 28% of residents speak a language other than English or Irish at home, including vibrant Polish, Indian, Romanian, and Italian communities.',
      economicDrivers: [
        'High-tech enterprise corridor (South Dublin)',
        'Adamstown Strategic Development Zone (SDZ)',
        'Lucan Village retail & hospitality',
        'Bio-pharmaceutical logistics (Grange Castle proximity)'
      ],
      infrastructureMilestones: [
        'Adamstown SDZ (first planned sustainable eco-suburb in Ireland)',
        'Lucan Village Architectural Conservation Area (ACA)',
        'DART+ West & Lucan Luas rapid transit corridors',
        'Opening of Parco Italia (2024–2025)'
      ]
    },
    famousFigures: [
      {
        name: 'Patrick Sarsfield, 1st Earl of Lucan',
        lifespan: '1660–1693',
        category: 'Military & Politics',
        significance: 'Jacobite Commander-in-Chief, hero of the 1690 Siege of Limerick, architect of the Ballyneety raid, and leader of the Flight of the Wild Geese.',
        quoteOrLegacy: 'Dying at the Battle of Landen in 1693, he uttered the immortal words: "Would that this were for Ireland." Commemorated with Carlini’s marble monument in Lucan House.'
      },
      {
        name: 'Agostino Carlini RA',
        lifespan: '1718–1790',
        category: 'Arts & Culture',
        significance: 'Italian neoclassical sculptor, founding member and Keeper of the Royal Academy of Arts, commissioned by Agmondisham Vesey to sculpt Lucan House’s decorative masterpieces.',
        quoteOrLegacy: 'Fused Continental Renaissance elegance with Irish Jacobite iconography, immortalizing Sarsfield in Carrara marble.'
      },
      {
        name: 'Rt. Hon. Agmondisham Vesey',
        lifespan: '1708–1785',
        category: 'Arts & Culture',
        significance: 'Accountant General of Ireland, politician, and gentleman architect who designed the 1772 neoclassical Lucan House villa with counsel from James Gandon.',
        quoteOrLegacy: 'Constructed one of the earliest neoclassical country villas in Ireland, celebrated for its perfect Palladian symmetry on the Liffey.'
      },
      {
        name: 'Arthur Cox',
        lifespan: '1891–1965',
        category: 'Industry & Enterprise',
        significance: 'Founder of Arthur Cox solicitors (Ireland’s pre-eminent corporate law firm) and President of the Incorporated Law Society. Resident and conservator of Lucan House (1925–1954) who later took holy orders as a Catholic priest.',
        quoteOrLegacy: 'Drafted key founding statutes for the fledgling Irish Free State while conserving Lucan House’s classical interiors before transferring the estate to the Italian Embassy.'
      },
      {
        name: 'Jane Wigham Shackleton',
        lifespan: '1843–1911',
        category: 'Arts & Culture',
        significance: 'Pioneering Irish documentary photographer, industrialist, and Quaker activist who chronicled 19th-century Irish working life from Anna Liffey House.',
        quoteOrLegacy: 'Bequeathed over 1,000 glass-plate negatives to the National Library of Ireland, capturing the human face of industrializing Ireland.'
      }
    ],
    niahHeritage: [
      {
        regNumber: '11202008',
        name: 'Lucan Chalybeate Mineral Spa Pumphouse',
        buildingName: 'Lucan Chalybeate Mineral Spa Pumphouse',
        originalUse: 'Mineral Spa Pumphouse & Hydrotherapy Chamber',
        category: 'Mineral Spa Pumphouse',
        yearBuilt: 'c. 1780',
        datePeriod: 'c. 1780',
        rating: 'Regional',
        architecturalStyle: 'Georgian Classical',
        description: 'Single-storey rusticated calp limestone pumphouse on the banks of the Liffey with a pedimented entrance and subterranean stone barrel-vaulted mineral well chamber.',
        appraisal: 'A rare and substantially intact surviving Georgian hydrotherapy pump house marking Lucan’s 18th-century boom as Dublin’s premier mineral water resort.'
      },
      {
        regNumber: '11202005',
        name: 'Lucan Bridge',
        buildingName: 'Lucan Bridge',
        originalUse: 'Road Bridge over River Liffey',
        category: 'Road Bridge',
        yearBuilt: '1814',
        datePeriod: '1814',
        rating: 'National',
        architecturalStyle: 'Regency Classical Engineering',
        description: 'Monumental single-span segmental arch bridge in cut limestone masonry spanning 110 feet across the River Liffey, designed by George Knowles.',
        appraisal: 'An engineering masterpiece; at 110 feet, it was the widest single stone arch in Ireland and the British Isles at the date of its completion.'
      },
      {
        regNumber: '11202012',
        name: 'Anna Liffey Flour Mill Complex',
        buildingName: 'Anna Liffey Flour Mill Complex',
        originalUse: 'Hydro-Powered Roller Flour Mill',
        category: 'Flour Mill Complex',
        yearBuilt: 'c. 1860',
        datePeriod: 'c. 1860',
        rating: 'Regional',
        architecturalStyle: 'Victorian Industrial Vernacular',
        description: 'Four-storey rubble limestone roller flour mill, headrace canal, undershot waterwheel housing, and miller’s domestic house operated by the Shackleton family.',
        appraisal: 'Of primary national industrial significance as one of the best-preserved continuous milling complexes along the River Liffey.'
      }
    ],
    biodiversity: {
      sacName: 'Liffey Valley Natural Heritage Area (pNHA Site 000128)',
      habitats: ['Alluvial wet woodland with wild mountain elms', 'Riverine calcicolous tufa springs', 'Fast-flowing limestone river riffles'],
      indicatorSpecies: [
        {
          commonName: 'Daubenton’s Bat',
          irishName: 'Ialtóg uisce',
          scientificName: 'Myotis daubentonii',
          status: 'Protected Native',
          notes: 'Specialist river-hunting bat that skims just centimeters above the Liffey surface to catch emerging mayflies and caddisflies.'
        },
        {
          commonName: 'Common Kingfisher',
          irishName: 'Cruidín',
          scientificName: 'Alcedo atthis',
          status: 'EU Birds Directive Annex I',
          notes: 'Breeds in vertical sandy banks along the Griffeen and Liffey confluence; indicator of pristine water clarity.'
        },
        {
          commonName: 'European River Otter',
          irishName: 'Madra uisce',
          scientificName: 'Lutra lutra',
          status: 'EU Habitats Directive Annex II & IV',
          notes: 'Thriving breeding population hunting salmonids between Lucan weir and the Strawberry Beds.'
        },
        {
          commonName: 'Wild Marshmallow Herb',
          irishName: 'Leamhán',
          scientificName: 'Althaea officinalis',
          status: 'Locally Significant Native',
          notes: 'The botanical root of Lucan’s Irish name (Leamhcán), flourishing along ancient alluvial silt flats.'
        }
      ],
      conservationNotes: 'The Liffey river corridor acts as a vital east-west wildlife biodiversity highway connecting the Dublin Mountains through Lucan to the Irish Sea.'
    },
    militaryWitnesses: [
      {
        bureauRef: 'BMH WS 0768',
        witnessName: 'Patrick J. Kelly',
        unitOrBrigade: '4th Battalion, Dublin Brigade IRA',
        period: '1916–1921 (War of Independence)',
        summary: 'Intelligence operations and the April 1920 burning of Lucan RIC Barracks to deny British forces control of the western artery.',
        eyewitnessExcerpt: 'On Easter Saturday night 1920, acting under general GHQ orders to destroy evacuated enemy posts, our company mobilized to burn the Lucan Barracks. We secured the perimeter along the main road, breached the rear, and destroyed the post completely without civilian casualty.',
        historicalContext: 'Part of the coordinated nationwide Easter 1920 campaign orchestrated by Michael Collins where over 300 evacuated police barracks were destroyed in a single night.'
      }
    ],
    motorwayArchaeology: [
      {
        siteName: 'Ballydowd & Esker (N4 Lucan Bypass Scheme)',
        excavationLicense: '93E0072 & 98E0411',
        roadScheme: 'N4 Lucan Bypass & Dual Carriageway Upgrade',
        period: 'Bronze Age',
        discovery: 'Rescue excavations directly beneath the road corridor unearthed three Bronze Age burnt mounds (fulachtaí fia), prehistoric flint scrapers, and early medieval iron-smelting slag pits.',
        museumArtifacts: [
          'Middle Bronze Age bronze palstave axehead (National Museum of Ireland, Reg. 1934:412)',
          'Socketed bronze spearhead dredged from Lucan Liffey weir'
        ]
      }
    ],
    literaryAndMusic: {
      literaryReferences: [
        {
          author: 'James Joyce',
          workTitle: 'Finnegans Wake',
          yearPublished: '1939',
          excerptOrTheme: 'from the weir of the Lucan to the sea... where the riverrun murmurs past Anna Livia at the mill',
          geographicalTie: 'Joyce repeatedly anchors the mythical female river figure Anna Livia Plurabelle along the mills, weirs, and elms of Lucan.'
        },
        {
          author: 'Jonathan Swift',
          workTitle: 'Letters & Verse to Esther Vanhomrigh',
          yearPublished: 'c. 1720',
          excerptOrTheme: 'The shady retreats of the Liffey and the mineral waters of Lucan.',
          geographicalTie: 'Swift frequently stayed with the Vesey family in Lucan while traveling westward across the Pale.'
        }
      ],
      traditionalMusic: [
        {
          tuneTitle: 'The Strawberry Beds',
          irishTitle: 'Gort na Sú Talún',
          tuneType: 'Reel',
          collectorOrComposer: 'Francis O’Neill (The Music of Ireland, 1903)',
          notes: 'A celebrated Leinster reel commemorating the traditional riverside strawberry fairs and dance platforms lining the Liffey downstream of Lucan bridge.'
        },
        {
          tuneTitle: 'The Banks of the Liffey',
          irishTitle: 'Bruacha na Life',
          tuneType: 'Hornpipe',
          collectorOrComposer: 'Traditional Dublin/Kildare Fiddlers',
          notes: 'Traditional hornpipe in D Major celebrating the boatmen and millers along the river.'
        }
      ]
    },
    climateAndSport: {
      climateEvent: {
        name: 'The Great Frost & Frozen Liffey',
        year: '1739–1740',
        phenomenon: 'Temperatures dropped to -15°C for seven consecutive weeks; the River Liffey at Lucan froze to a depth of three feet.',
        impactOnSettlement: 'Mill waterwheels at Anna Liffey were frozen solid in pack ice, bringing all flour milling to an abrupt halt and causing widespread hardship that forced communal bread relief.'
      },
      equineAndGaa: {
        gaaTradition: 'Lucan Sarsfields GAA (founded 1886) is among the earliest GAA clubs in County Dublin, playing on historic pitches near the 12th Lock.',
        thoroughbredTradition: 'Weston Estate and Hermitage bloodlines provided stud stallions for the Curragh and Phoenix Park racecourses.'
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
      },
      {
        id: 'lucan-parco-italia',
        title: 'Parco Italia: The €10.5M Handover & 70 Years of Italian Diplomacy',
        category: 'diaspora',
        hookSnippet: 'How the Italian Ambassador’s private 12-hectare estate became South Dublin’s newest public park.',
        spokenNarrative: 'In May 2024, Italian President Sergio Mattarella and President Michael D. Higgins celebrated the historic ten-and-a-half million euro acquisition of Lucan House by South Dublin County Council. For seventy years, the Palladian villa was the private residence of the Italian Ambassador. Today it is being reborn as Parco Italia—a flagship public park and cultural center uniting Irish history and Italian artistry along the Liffey.',
        detailMarkdown: 'Acquisition finalized May 2024 by South Dublin County Council in partnership with the Italian State. Features 12 hectares of ancient woodland, Carlini stuccowork, and riverside biodiversity.'
      },
      {
        id: 'lucan-national-gallery',
        title: 'Masterpieces of the Liffey: William Ashford & The National Gallery',
        category: 'art',
        hookSnippet: 'How 18th-century painters immortalized Lucan House, King John’s Bridge, and the winding Liffey.',
        spokenNarrative: 'The wooded bend of the Liffey at Lucan inspired Ireland’s greatest landscape painters. In 1795, William Ashford, the first President of the Royal Hibernian Academy, captured Lucan House and its single-arch stone bridge in a celebrated oil painting now hanging in the National Gallery of Ireland. Later, James Arthur O’Connor and Jane Wigham Shackleton continued this artistic tradition through Romantic oils and pioneer photography.',
        detailMarkdown: 'National Gallery of Ireland (NGI Collection) & National Library of Ireland Prints & Drawings.'
      },
      {
        id: 'lucan-cso-boom',
        title: 'The Modern Lucan Miracle: From 792 Millers to 57,000 Cosmopolitans',
        category: 'demographics',
        hookSnippet: 'CSO 2022 Census records reveal an astounding 7,169% population surge since 1911.',
        spokenNarrative: 'In 1911, Lucan was a tranquil village of 792 millers and spa attendants. According to the 2022 Census from the Central Statistics Office, Lucan has surged by over seven thousand percent to more than fifty-seven thousand residents. Today it stands as one of Ireland’s youngest and most multicultural suburban communities, pioneering sustainable urban living in the Adamstown Strategic Development Zone.',
        detailMarkdown: 'Central Statistics Office (CSO) Census 2022 (DEDs Lucan-Esker, Lucan Heights, Adamstown).'
      },
      {
        id: 'lucan-niah-bridge',
        title: 'Lucan Bridge: The 1814 Wonder & Widest Stone Arch in Ireland',
        category: 'architecture',
        hookSnippet: 'George Knowles’ 110-foot single stone span that broke British and Irish engineering records.',
        spokenNarrative: 'Completed in 1814 under engineer George Knowles, Lucan Bridge spans the River Liffey in a single triumphant cut-limestone arch of one hundred and ten feet. At the time of its opening, it stood as the widest single-span masonry bridge anywhere in Ireland or Great Britain, carrying horse mail coaches safely above the winter Liffey torrents.',
        detailMarkdown: 'National Inventory of Architectural Heritage (NIAH Reg. 11202005). Rated of National architectural and engineering significance.'
      },
      {
        id: 'lucan-1920-barracks',
        title: 'The Easter 1920 Raid: How the IRA Burned the Lucan RIC Barracks',
        category: 'military',
        hookSnippet: 'Bureau of Military History witness statements recount the coordinated midnight raid.',
        spokenNarrative: 'On Easter Saturday night 1920, the 4th Battalion of the Dublin Brigade IRA carried out a coordinated operation to destroy the Lucan police barracks. In sworn witness statements preserved in the Military Archives, Volunteer Patrick Kelly describes securing the road perimeter and burning the garrison post to deny Crown forces control of the western highway.',
        detailMarkdown: 'Bureau of Military History (BMH WS 0768 - Patrick J. Kelly, 4th Battalion, Dublin Brigade IRA).'
      },
      {
        id: 'lucan-joyce-wake',
        title: 'Anna Livia at Lucan Weir: James Joyce’s Finnegans Wake',
        category: 'literature',
        hookSnippet: 'How the River Liffey at Lucan became the eternal heroine of Joyce’s masterpiece.',
        spokenNarrative: 'In James Joyce’s landmark masterpiece Finnegans Wake, the River Liffey personified as Anna Livia Plurabelle flows eternally through Lucan. Joyce weaves the salmon weirs, the Anna Liffey flour mills, and the Strawberry Beds into his nocturnal prose, celebrating Lucan as the pastoral threshold where the river begins its final journey to Dublin Bay.',
        detailMarkdown: 'James Joyce, Finnegans Wake (1939). Literary Geography of Dublin & Kildare.'
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
    artReferences: [
      {
        id: 'art-leix-01',
        artist: 'Francis Wheatley RA',
        artistLifespan: '1747–1801',
        artworkTitle: 'The Salmon Leap, Leixlip',
        yearCreated: '1783',
        medium: 'Oil on canvas',
        galleryOrCollection: 'National Gallery of Ireland (NGI)',
        catalogRef: 'NGI.4363',
        description: 'One of the most famous landscape paintings in Irish art history. Wheatley captures the roaring whitewater rapids of the River Liffey cascading over limestone rocks, with country folk resting in the foreground and the 12th-century tower of Leixlip Castle framed through the spray.',
        culturalSignificance: 'Showcases the Georgian fascination with the Irish Sublime; Wheatley fled London for Dublin in 1779 and produced his most acclaimed Irish landscape masterpieces along the Liffey Valley.'
      },
      {
        id: 'art-leix-02',
        artist: 'Thomas Roberts',
        artistLifespan: '1748–1778',
        artworkTitle: 'The Salmon Leap at Leixlip',
        yearCreated: 'c. 1775',
        medium: 'Oil on canvas',
        galleryOrCollection: 'Carton Demesne Collection / National Gallery of Ireland Loan',
        description: 'A magnificent Rococo landscape depicting the torrent of the Liffey falls with dramatic stormy clouds and anglers casting for wild salmon from the limestone ledges.',
        culturalSignificance: 'Regarded by art historians as Roberts’ crowning landscape achievement prior to his tragic early death in Lisbon at age 30.'
      },
      {
        id: 'art-leix-03',
        artist: 'Jonathan Fisher',
        artistLifespan: 'c. 1740–1809',
        artworkTitle: 'A View of the Salmon Leap at Leixlip',
        yearCreated: '1792',
        medium: 'Aquatint & line engraving',
        galleryOrCollection: 'National Library of Ireland / British Museum Collection',
        catalogRef: 'NLI Prints 1792-FISH',
        description: 'Published in Fisher’s "Scenery of Ireland", this detailed engraving documents the rustic watermills clinging to the cliffside below Leixlip Castle and the roaring cataract.',
        culturalSignificance: 'Helped establish the Grand Tour itinerary for visitors exploring the wild romantic topography within a day’s ride of Dublin.'
      }
    ],
    communityLinks: [
      {
        id: 'link-leix-viking',
        communityName: 'Norse-Gaelic Viking Frontier Kingdom (Dyflinarskiri)',
        connectionEra: '9th–11th Century',
        flagEmoji: '🇳🇴',
        summary: 'Derived from Old Norse Lax-hlaup (Salmon Leap), Leixlip marked the fortified western boundary of the Viking Kingdom of Dublin.',
        narrative: 'When Norse sea-kings ruled Dublin (Dyflin), their war longboats rowed up the Liffey as far as the roaring limestone waterfall. Unable to navigate further upstream, they built a frontier trading post and salmon fishery known in Old Norse as Lax-hlaup. It formed the fortified march separating the Norse Ostmen from the warlike Gaelic tribes of Ui Faelain.',
        keyFiguresOrMilestones: [
          '9th Century: Old Norse placename Lax-hlaup established',
          'Frontier boundary marker between Dyflinarskiri and Gaelic Leinster',
          'Preserved as one of only a handful of inland Scandinavian placenames in Ireland'
        ]
      },
      {
        id: 'link-leix-intel',
        communityName: 'Silicon Valley Transatlantic High-Tech Partnership (Intel Ireland)',
        connectionEra: '1989–Present',
        flagEmoji: '🇺🇸',
        summary: 'Over $20 billion in capital investment made Leixlip the European manufacturing epicenter of advanced silicon microprocessors.',
        narrative: 'In 1989, Intel selected the former Collinstown stud farm in Leixlip for its flagship European manufacturing operations. Over three decades, that partnership invested more than $20 billion, culminating in Fab 34—the only high-volume manufacturing semiconductor fab in Europe utilizing Extreme Ultraviolet (EUV) lithography for Intel 4 microprocessors. It created a thriving international community of thousands of engineers, connecting Kildare directly to global silicon technology.',
        keyFiguresOrMilestones: [
          '1989: Groundbreaking on 360-acre Collinstown campus',
          'Over $20 billion total corporate capital investment',
          'Fab 34: European exclusive EUV lithography manufacturing center',
          '4,500+ direct high-tech engineering employees'
        ]
      }
    ],
    csoModern: {
      censusYear: 2022,
      population2022: 16733,
      growthFrom1911Pct: '+1,877%',
      households2022: 5642,
      broadbandCoveragePct: 98.4,
      demographicProfile: 'One of the most highly educated communities in the European Union, with 62.4% of adults holding third-level STEM degrees. Hosts a vibrant international diaspora of engineers, scientists, and technicians from over 40 countries.',
      economicDrivers: [
        'Intel Ireland European Semiconductor Manufacturing (Fab 34)',
        'Rye Water Valley biodiversity ecotourism',
        'Royal Canal Greenway leisure corridor',
        'Life sciences and advanced software engineering'
      ],
      infrastructureMilestones: [
        'Intel Fab 34 EUV lithography expansion ($18.5B investment)',
        'Louisa Bridge & Leixlip Confey DART+ West electrification',
        'Wonderful Barn heritage conservation precinct',
        'Rye Water Valley Special Area of Conservation (SAC)'
      ]
    },
    famousFigures: [
      {
        name: 'Arthur Guinness',
        lifespan: '1725–1803',
        category: 'Industry & Enterprise',
        significance: 'Master brewer who perfected his porter recipes and founded his first brewery on Leixlip Main Street in 1755 with a £100 legacy from Archbishop Price.',
        quoteOrLegacy: 'Laid the bedrock of the world’s most recognizable stout brand four years before taking the 9,000-year lease on St. James’s Gate in 1759.'
      },
      {
        name: 'Hon. Desmond Guinness & Mariga Guinness',
        lifespan: 'Desmond (1931–2020), Mariga (1932–1989)',
        category: 'Arts & Culture',
        significance: 'Pioneering architectural preservationists who founded the Irish Georgian Society in 1958 at Leixlip Castle, saving Castletown House and Dublin’s 18th-century heritage from destruction.',
        quoteOrLegacy: 'Rescued Ireland’s Palladian masterpieces from demolition, turning Leixlip Castle into an international salon of art, architecture, and conservation.'
      },
      {
        name: 'Katherine Conolly (Lady Conolly)',
        lifespan: '1662–1752',
        category: 'Military & Politics',
        significance: 'Philanthropist, landowner, and widow of Speaker William Conolly who commissioned the Wonderful Barn (1743) and Conolly Folly to provide employment during the famine of 1740.',
        quoteOrLegacy: 'Celebrated by contemporaries as the "Grand Governess of Ireland", using her vast fortune to construct architectural wonders that sustained thousands of local laborers.'
      },
      {
        name: 'Speaker William Conolly',
        lifespan: '1662–1729',
        category: 'Military & Politics',
        significance: 'Speaker of the Irish House of Commons and wealthiest commoner in Ireland, builder of Castletown House (Ireland’s earliest and grandest Palladian mansion).',
        quoteOrLegacy: 'A self-made Donegal lawyer who rose to become the undisputed master of Irish parliamentary politics and patron of Italian Palladian architecture.'
      }
    ],
    niahHeritage: [
      {
        regNumber: '11804001',
        name: 'Leixlip Toll House & Liffey Bridge',
        buildingName: 'Leixlip Toll House & Liffey Bridge',
        category: 'Toll house & Road bridge',
        datePeriod: 'c. 1780 & 1734',
        rating: 'National',
        description: 'Single-storey polygonal cut-stone toll house commanding the three-arch coursed limestone bridge spanning the River Liffey, historically collecting tolls on the Dublin-Galway turnpike.'
      },
      {
        regNumber: '11804014',
        name: 'The Wonderful Barn & Pigeon House',
        buildingName: 'The Wonderful Barn & Pigeon House',
        category: 'Folly / Agricultural Granary',
        datePeriod: '1743',
        rating: 'National',
        description: 'Conical, multi-tiered corkscrew granary folly constructed of calp limestone rubble with an external cantilevered spiral staircase and dome, commissioned by Katherine Conolly.'
      },
      {
        regNumber: '11804020',
        name: 'Rye Water Aqueduct',
        buildingName: 'Rye Water Aqueduct',
        category: 'Canal Aqueduct & Bridge',
        datePeriod: '1796',
        rating: 'National',
        description: 'Monumental four-tier masonry aqueduct rising nearly 100 feet to carry the Royal Canal across the Rye Water valley, designed by Richard Evans and John Rennie.'
      }
    ],
    biodiversity: {
      sacOrSpa: 'Rye Water Valley / Carton SAC (Site Code 001398)',
      designationType: 'Special Area of Conservation (SAC) & pNHA',
      indicatorSpecies: [
        {
          commonName: 'Narrow-mouthed Whorl Snail',
          irishName: 'Caisearbhán béalchúng',
          scientificName: 'Vertigo angustior',
          status: 'EU Habitats Directive Annex II',
          notes: 'Ice-age relict mollusc dependent on open marsh and calcareous tufa springs at Louisa Bridge; one of Europe’s most critical populations.'
        },
        {
          commonName: "Desmoulin's Whorl Snail",
          irishName: 'Caisearbhán mór',
          scientificName: 'Vertigo moulinsiana',
          status: 'EU Habitats Directive Annex II',
          notes: 'High-conservation-priority wetland snail living on the wet leaves of reed-grasses along the Rye Water marshes.'
        },
        {
          commonName: 'Brown Trout',
          irishName: 'Breac donn',
          scientificName: 'Salmo trutta',
          status: 'Native Salmonid',
          notes: 'Major spawning river with premier fly-fishing riffles flowing over limestone gravel beds.'
        },
        {
          commonName: 'Petrifying Springs with Tufa Formation',
          irishName: 'Toibreacha eathartha',
          scientificName: 'Cratoneurion commutati',
          status: 'EU Habitats Directive Priority Habitat *7220',
          notes: 'Geothermal calcium carbonate springs precipitating porous limestone tufa rock formations along the riverbanks.'
        }
      ],
      conservationNotes: 'The mineral springs at Louisa Bridge maintain a steady 15°C geothermal microclimate that sheltered relict ice-age flora and fauna for over 10,000 years.'
    },
    militaryWitnesses: [
      {
        bureauRef: 'BMH WS 0532',
        witnessName: 'Michael J. Smyth',
        unitOrBrigade: '1st Battalion, North Kildare Brigade IRA',
        period: '1919–1921 (War of Independence)',
        summary: 'Railway sabotage and the April 1921 Louisa Bridge railway ambush on Crown troop transports.',
        eyewitnessExcerpt: 'In April 1921, our North Kildare flying column laid an ambush at Louisa Bridge station. We decoupled the rails on the Midland Great Western line to halt military troop trains moving between Dublin and the Curragh military camp.',
        historicalContext: 'North Kildare was a critical transit artery connecting Dublin Castle with the British military headquarters at the Curragh Camp.'
      }
    ],
    motorwayArchaeology: [
      {
        siteName: 'Collinstown & Barnhall (M4 Celbridge/Leixlip Interchange)',
        excavationLicense: '99E0542 & 01E0688',
        roadScheme: 'M4 Motorway Kilcock-Enfield-Kinnegad Scheme',
        period: 'Iron Age & Early Medieval',
        discovery: 'Rescue excavations before motorway construction revealed an extensive Iron Age ring-ditch cemetery, cremations, and an 8th-century bronze penannular ring-brooch.',
        museumArtifacts: [
          'Viking 10th-century iron battleaxe head dredged from the Rye Water (National Museum of Ireland, Reg. 1928:342)',
          'Cast bronze zoomorphic ring-brooch from Barnhall ringfort'
        ]
      }
    ],
    literaryAndMusic: {
      literaryReferences: [
        {
          author: 'Jonathan Swift',
          workTitle: 'Cadenus and Vanessa',
          yearPublished: '1726',
          excerptOrTheme: 'The wooded falls of Celbridge and Leixlip where Vanessa kept her garden bower beside the roaring rapids.',
          geographicalTie: 'Dean Swift regularly walked from Leixlip to Celbridge Abbey to court Esther Vanhomrigh (Vanessa).'
        },
        {
          author: 'Samuel Lover',
          workTitle: 'Legends and Stories of Ireland',
          yearPublished: '1831',
          excerptOrTheme: 'The Salmon Leap cataract and the enchanted leaping fish of Leixlip.',
          geographicalTie: 'Lover set several humorous folklore sketches around the anglers and toll keepers at Leixlip Bridge.'
        }
      ],
      traditionalMusic: [
        {
          tuneTitle: 'The Salmon Leap',
          irishTitle: 'Léim an Bhradáin',
          tuneType: 'Reel',
          collectorOrComposer: 'Francis O’Neill (Waifs and Strays of Gaelic Melody)',
          notes: 'A brisk D major reel mimicking the sudden upward surge and leap of Atlantic salmon over the waterfall.'
        },
        {
          tuneTitle: 'The Rye Water Jig',
          irishTitle: 'Port Abhainn na Rí',
          tuneType: 'Jig',
          collectorOrComposer: 'Kildare Traditional Fiddlers',
          notes: 'Traditional 6/8 double jig associated with harvest dances along the Kildare/Dublin border.'
        }
      ]
    },
    climateAndSport: {
      climateEvent: {
        name: 'The Great Frost & Katherine Conolly’s Relief Works',
        year: '1740–1741',
        phenomenon: 'The "Year of the Slaughter" (Bliain an Áir); severe Arctic freezing froze rivers solid, destroying potato crops across Leinster.',
        impactOnSettlement: 'Katherine Conolly commissioned the Wonderful Barn and the Conolly Folly specifically to provide food, wages, and dignity to starving tenant families.'
      },
      equineAndGaa: {
        gaaTradition: 'Leixlip GAA Club (founded 1887, Radley Park) has competed in Kildare football and hurling championships for over 135 years.',
        thoroughbredTradition: 'Salmon Leap Canoe Club (founded 1962) has produced dozens of Olympic and World Championship marathon kayakers training on the Liffey waters.'
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
      },
      {
        id: 'leixlip-wheatley-art',
        title: 'Francis Wheatley & The Salmon Leap: Masterpiece of the National Gallery',
        category: 'art',
        hookSnippet: 'The 1783 painting that captured the roaring Liffey waterfall and 18th-century society.',
        spokenNarrative: 'In 1783, English painter Francis Wheatley stood on the limestone cliffs of Leixlip and painted The Salmon Leap, today celebrated as one of the National Gallery of Ireland’s greatest treasures. Wheatley depicted the turbulent foam of the Liffey falls, wild Atlantic salmon leaping upstream, and fashionable Georgian spectators admiring the sublime power of nature.',
        detailMarkdown: 'National Gallery of Ireland (Cat. NGI.4363). Oil on canvas, acquired 1978. Exhibited in the Great Irish Landscape gallery.'
      },
      {
        id: 'leixlip-silicon-intel',
        title: 'From Norse Salmon to Silicon Chips: The $20B Intel Fab 34 Campus',
        category: 'diaspora',
        hookSnippet: 'How Leixlip transformed from a rural village into Europe’s most advanced microchip powerhouse.',
        spokenNarrative: 'Over a thousand years ago, Norse Vikings gave Leixlip its name at the salmon leap. Today, Leixlip is the technological beating heart of modern Europe. Since 1989, Intel has invested over twenty billion dollars here at Collinstown, building Fab 34—the only manufacturing facility in Europe using Extreme Ultraviolet lithography to print microprocessors on the scale of atoms.',
        detailMarkdown: 'Intel Ireland Campus, Leixlip. Employs over 4,500 high-tech engineers and anchors Ireland’s knowledge economy.'
      },
      {
        id: 'leixlip-cso-metrics',
        title: 'The Modern Leixlip Pulse: 1,877% Growth & Europe’s STEM Capital',
        category: 'demographics',
        hookSnippet: 'CSO 2022 Census data shows 62% of adults hold STEM degrees in Kildare’s high-tech haven.',
        spokenNarrative: 'From just 846 canal workers and maltsters in the 1911 Census, Leixlip has expanded to nearly seventeen thousand residents in 2022. According to Central Statistics Office data, over sixty-two percent of working adults hold third-level STEM degrees—ranking Leixlip among the highest-skilled engineering communities in the entire European Union.',
        detailMarkdown: 'Central Statistics Office (CSO) Census 2022 (DED Leixlip).'
      },
      {
        id: 'leixlip-sac-snail',
        title: 'The Ice Age Relict: Narrow-Mouthed Whorl Snails of Louisa Bridge',
        category: 'ecology',
        hookSnippet: 'How 15°C geothermal springs preserved an ancient prehistoric mollusc.',
        spokenNarrative: 'At Louisa Bridge in Leixlip lies one of Europe’s most extraordinary nature sanctuaries—the Rye Water Valley SAC. Geothermal mineral springs bubbling up at a constant fifteen degrees Celsius have created rare tufa limestone terraces. In these petrifying marshes lives the tiny Narrow-Mouthed Whorl Snail, a prehistoric survivor from the last Ice Age protected under European law.',
        detailMarkdown: 'National Biodiversity Data Centre & National Parks and Wildlife Service (Site Code 001398). Features Vertigo angustior and Vertigo moulinsiana.'
      },
      {
        id: 'leixlip-1921-rail',
        title: 'The Louisa Bridge Ambush: North Kildare IRA on the Western Rails',
        category: 'military',
        hookSnippet: 'Sworn military witness statements reveal the April 1921 railway guerrilla raid.',
        spokenNarrative: 'In sworn witness statements from the Bureau of Military History, Captain Michael Smyth describes how North Kildare IRA volunteers carried out a coordinated ambush at Louisa Bridge station in April 1921. By loosening the railway tracks on the Midland Great Western line, the flying column halted British troop trains moving reinforcements from the Curragh camp into Dublin city.',
        detailMarkdown: 'Bureau of Military History (BMH WS 0532 - Michael J. Smyth, North Kildare Brigade IRA).'
      },
      {
        id: 'leixlip-m4-viking',
        title: 'Viking Battleaxes & Iron Age Rings: Motorway Archaeology of the M4',
        category: 'excavation',
        hookSnippet: 'Rescue excavations during motorway construction uncovered two millennia of hidden burials.',
        spokenNarrative: 'When the M4 motorway was cut through Collinstown and Barnhall, Transport Infrastructure Ireland rescue archaeologists discovered buried Iron Age cremation pits and ancient bronze jewellery. Nearby, dredgers in the Rye Water recovered a fearsome tenth-century Viking battleaxe head, proving Norse warriors patrolled these waters during the Kingdom of Dublin.',
        detailMarkdown: 'Transport Infrastructure Ireland (TII) Excavation License 99E0542 & National Museum of Ireland Viking Antiquities Collection.'
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
    artReferences: [
      {
        id: 'art-may-01',
        artist: 'Thomas Roberts',
        artistLifespan: '1748–1778',
        artworkTitle: 'A View of Carton Demesne',
        yearCreated: '1776',
        medium: 'Oil on canvas',
        galleryOrCollection: 'National Gallery of Ireland (NGI)',
        catalogRef: 'NGI Collection',
        description: 'Commissioned by William FitzGerald, 2nd Duke of Leinster, this panoramic oil portrays the Sheet of Water lake, the Palladian bridge, Shell Cottage, and herds of deer grazing in Carton parkland.',
        culturalSignificance: 'Hailed as the supreme triumph of 18th-century Irish estate landscape painting, capturing the pinnacle of Georgian landscaping designed by Capability Brown-influenced architects.'
      },
      {
        id: 'art-may-02',
        artist: 'Paolo & Filippo Francini (The Francini Brothers)',
        artistLifespan: 'Flourished 1730s–1760s',
        artworkTitle: 'The Carton House Saloon Ceiling: The Courtship of the Gods',
        yearCreated: '1739',
        medium: 'High-relief Baroque stuccowork & gold leaf',
        galleryOrCollection: 'Carton House / Office of Public Works (OPW)',
        description: 'A dazzling three-dimensional plaster ceiling created by Swiss-Italian stuccodori Paolo and Filippo Francini for the 19th Earl of Kildare, depicting Jupiter, Juno, Mercury, and the Olympian gods in breathtaking sculptural relief.',
        culturalSignificance: 'Universally recognized as the finest Baroque plaster ceiling in Western Europe, revolutionizing Irish interior decorative art.'
      },
      {
        id: 'art-may-03',
        artist: 'Augustus Welby Pugin',
        artistLifespan: '1812–1852',
        artworkTitle: 'St. Patrick’s College Quadrangle, Cloisters & College Chapel',
        yearCreated: '1845–1850',
        medium: 'Cut ashlar limestone architecture, stained glass & Gothic choir stalls',
        galleryOrCollection: 'St. Patrick’s Pontifical University, Maynooth',
        description: 'The monumental neo-Gothic collegiate quadrangle designed by Pugin, featuring soaring perpendicular cloisters, 454 hand-carved oak choir stalls, and stained glass produced by Franz Mayer of Munich.',
        culturalSignificance: 'The crowning achievement of Pugin’s ecclesiastical work in Ireland, creating one of the largest and most complete Gothic Revival campus ensembles in the world.'
      }
    ],
    communityLinks: [
      {
        id: 'link-may-sorbonne',
        communityName: 'French Revolution Sorbonne Refugee Scholars',
        connectionEra: '1795–1820s',
        flagEmoji: '🇫🇷',
        summary: 'Fleeing the Terror of the French Revolution, Sorbonne academics established Maynooth’s academic foundations in 1795.',
        narrative: 'When the French Revolution shuttered the historic Irish Colleges in Paris, Nantes, and Bordeaux, the British Parliament chartered St. Patrick’s College in 1795. French academic refugees from the Sorbonne—notably Fr. François Anglade (former Professor of Divinity at the Sorbonne) and Fr. André Darré (Professor of Mathematics and Philosophy from Toulouse)—traveled to Maynooth to form its inaugural faculty, imbuing the college with European scholastic rigor.',
        keyFiguresOrMilestones: [
          '1795: Act of Parliament establishes St. Patrick’s College',
          'Fr. François Anglade of the Sorbonne appointed Chair of Divinity',
          'Fr. André Darré of Toulouse brings Continental mathematics & physics',
          'Direct intellectual bridge between Paris Enlightenment and Kildare academia'
        ]
      },
      {
        id: 'link-may-francini',
        communityName: 'Swiss-Italian Alpine Baroque Stuccodori',
        connectionEra: '1739–1750s',
        flagEmoji: '🇨🇭',
        summary: 'Master craftsmen Paolo and Filippo Francini brought Swiss-Italian stucco mastery to Carton House, transforming Irish architectural design.',
        narrative: 'Hailing from the Italian-speaking Swiss canton of Ticino, the Francini brothers were invited to Carton House in 1739 by the Earl of Kildare. Their virtuoso stucco ceilings at Carton, Russborough, and Castletown established a Continental Italian artistic renaissance in 18th-century Ireland, blending mythological grandeur with delicate rococo flourish.',
        keyFiguresOrMilestones: [
          '1739: Saloon Ceiling at Carton House completed',
          'Paolo & Filippo Francini of Ticino, Switzerland',
          'Influence on Dublin school of master plasterers (Robert West & Michael Stapleton)'
        ]
      }
    ],
    csoModern: {
      censusYear: 2022,
      population2022: 17259,
      growthFrom1911Pct: '+1,146%',
      households2022: 5214,
      broadbandCoveragePct: 98.6,
      demographicProfile: 'Ireland’s only historic university town, with the youngest median age in the state at 28.4 years. Maynooth University hosts over 15,000 undergraduate, postgraduate, and international researchers from 90+ nations.',
      economicDrivers: [
        'Maynooth University & St Patrick’s Pontifical University',
        'Maynooth Works Technology Transfer & Incubation Campus',
        'Bioscience, Artificial Intelligence & Software Innovation Hub',
        'Carton House Fairmont luxury tourism & golf resort'
      ],
      infrastructureMilestones: [
        'Maynooth University Technology Campus expansion ($300M+)',
        'DART+ West electrification terminus at Maynooth Railway Station',
        'Royal Canal Greenway National Cycle Network',
        'Maynooth Castle & Carton Avenue Heritage Trail'
      ]
    },
    famousFigures: [
      {
        name: 'Paul Mescal',
        lifespan: 'Born 1996',
        category: 'Arts & Culture',
        significance: 'Academy Award, BAFTA, and Olivier Award-winning actor (Normal People, Aftersun, All of Us Strangers, Gladiator II). Born and raised in Maynooth, and former Kildare minor GAA football captain.',
        quoteOrLegacy: 'Proud Maynooth native who trained at the Maynooth Post Primary School and Maynooth GAA club, rising to become one of the most acclaimed screen actors of his generation.'
      },
      {
        name: 'Rev. Prof. Nicholas Callan',
        lifespan: '1799–1864',
        category: 'Science & Innovation',
        significance: 'Professor of Natural Philosophy who invented the induction coil in 1836 (the foundational transformer principle), the "Maynooth Battery", and high-voltage electricity generation.',
        quoteOrLegacy: 'Awarded an IEEE Milestone in Electrical Engineering. His induction coil was the direct ancestor of modern electrical transformers and automobile ignition coils.'
      },
      {
        name: 'Lord Edward FitzGerald',
        lifespan: '1763–1798',
        category: 'Military & Politics',
        significance: 'Aristocratic military commander of the Society of United Irishmen in the 1798 Rebellion. Raised at Carton House and passionate advocate of universal liberty.',
        quoteOrLegacy: 'Renounced his aristocratic titles to fight for an independent Irish republic uniting Catholic, Protestant, and Dissenter; fatally wounded during his arrest in Dublin in May 1798.'
      },
      {
        name: 'Lord Thomas FitzGerald ("Silken Thomas")',
        lifespan: '1513–1537',
        category: 'Military & Politics',
        significance: '10th Earl of Kildare who led the 1534 rebellion against King Henry VIII, defending Maynooth Castle against English siege artillery.',
        quoteOrLegacy: 'Renowned for the silk banners adorning his knights’ helmets, whose rebellion and subsequent execution at Tyburn marked the end of semi-independent Anglo-Norman rule in the Pale.'
      }
    ],
    niahHeritage: [
      {
        regNumber: '11803022',
        name: 'Maynooth Railway Station & Cast-Iron Canopy',
        buildingName: 'Maynooth Railway Station & Cast-Iron Canopy',
        category: 'Railway Station & Footbridge',
        datePeriod: '1847',
        rating: 'National',
        description: 'Midland Great Western Railway station featuring cut-limestone ashlar buildings, original wrought-iron lattice footbridge, and ornate cast-iron passenger platform canopies engineered by George Willoughby Hemans.'
      },
      {
        regNumber: '11803015',
        name: 'St. Patrick’s College Pugin Quadrangle & College Chapel',
        buildingName: 'St. Patrick’s College Pugin Quadrangle & College Chapel',
        category: 'Collegiate & Ecclesiastical',
        datePeriod: '1845–1850',
        rating: 'National',
        description: 'Masterpiece of Neo-Gothic architecture designed by Augustus Welby Pugin, featuring the soaring 273-foot collegiate chapel spire, vaulted cloisters, and carved limestone arches.'
      },
      {
        regNumber: '11803030',
        name: 'Carton Avenue Gate Lodge & Screen',
        buildingName: 'Carton Avenue Gate Lodge & Screen',
        category: 'Gate lodge & Demesne entrance',
        datePeriod: 'c. 1760',
        rating: 'Regional',
        description: 'Wrought-iron gates flanked by rusticated ashlar limestone piers terminating the ceremonial two-kilometer tree-lined avenue connecting Maynooth Castle with Carton House.'
      }
    ],
    biodiversity: {
      sacOrSpa: 'Carton Demesne Woodlands & Rye Water Corridor',
      designationType: 'Proposed Natural Heritage Area (pNHA 001398)',
      indicatorSpecies: [
        {
          commonName: 'Ancient Yew Tree (Silken Thomas Yew)',
          irishName: 'Iúr ársa',
          scientificName: 'Taxus baccata',
          status: 'Ancient Heritage Tree (750+ years old)',
          notes: 'Oldest documented cultivated tree in Ireland with a trunk girth of 14 feet, standing beside Maynooth Castle gate.'
        },
        {
          commonName: 'Soprano Pipistrelle Bat',
          irishName: 'Ialtóg fheannógach',
          scientificName: 'Pipistrellus pygmaeus',
          status: 'EU Habitats Directive Annex IV',
          notes: 'Colonies roost in the 18th-century collegiate attics and forage over the Lyreen River and Carton Lake.'
        },
        {
          commonName: 'Brown Trout',
          irishName: 'Breac donn',
          scientificName: 'Salmo trutta',
          status: 'Native Salmonid',
          notes: 'Native spawning populations throughout the gravel shallows of the Lyreen River.'
        },
        {
          commonName: 'English Oak & Lime Trees',
          irishName: 'Dair agus Teile',
          scientificName: 'Quercus robur / Tilia cordata',
          status: 'Protected Parkland Woodland',
          notes: 'Spectacular 2-kilometer ceremonial avenue planted with over 300 mature broadleaf lime trees in the 1760s.'
        }
      ],
      conservationNotes: 'The ancient deciduous woodlands and lake system of Carton Demesne support a rare biodiversity haven for woodland raptors, badgers, and all native Irish bat species.'
    },
    militaryWitnesses: [
      {
        bureauRef: 'BMH WS 0341',
        witnessName: 'Patrick Colgan',
        unitOrBrigade: 'Maynooth Company, Irish Volunteers',
        period: 'Easter Week 1916',
        summary: 'The 15-mile march of the Maynooth Volunteers on foot to join Patrick Pearse at the Dublin GPO.',
        eyewitnessExcerpt: 'On Easter Monday morning 1916, fifteen of us mobilized at Maynooth under arms. We marched fifteen miles on foot along the canal and railway line directly into Dublin city, reporting to James Connolly and Patrick Pearse inside the General Post Office, remaining under heavy artillery fire until the surrender.',
        historicalContext: 'The Maynooth Company was the only provincial Volunteer company outside Dublin city to successfully break through Crown cordons and fight inside the GPO during the 1916 Easter Rising.'
      }
    ],
    motorwayArchaeology: [
      {
        siteName: 'Railpark & Moyglare (M4 Maynooth Bypass Scheme)',
        excavationLicense: '92E0147 & 94E0025',
        roadScheme: 'M4 Kilcock-Maynooth Motorway Scheme',
        period: 'Middle-to-Late Bronze Age (1200–800 BC)',
        discovery: 'A palisaded Bronze Age settlement enclosure containing circular timber post-hole houses, burnt mounds, amber beads imported from the Baltic Sea, and gold hair-rings.',
        museumArtifacts: [
          'Late Bronze Age cast bronze sunflower pin (National Museum of Ireland, Reg. 1993:104)',
          'Baltic amber necklace beads recovered from Railpark ritual ditch'
        ]
      }
    ],
    literaryAndMusic: {
      literaryReferences: [
        {
          author: 'Fr. Peadar Ua Laoghaire',
          workTitle: 'Séadna & Mo Sgéal Féin',
          yearPublished: '1904 & 1915',
          excerptOrTheme: 'Gaelic language revival and the seminary lecture rooms of St. Patrick’s College.',
          geographicalTie: 'Father Peadar studied at Maynooth and spearheaded the Modern Irish literary movement from the college halls.'
        },
        {
          author: 'Lord Edward FitzGerald',
          workTitle: 'Letters & Revolutionary Verse',
          yearPublished: '1797–1798',
          excerptOrTheme: 'The lime groves of Carton and Maynooth, and devotion to an independent Irish republic.',
          geographicalTie: 'The charismatic United Irishmen military leader spent his youth at Carton House and Maynooth before the 1798 Rebellion.'
        }
      ],
      traditionalMusic: [
        {
          tuneTitle: 'The Humours of Maynooth',
          irishTitle: 'Pléaráca Mhaigh Nuadhad',
          tuneType: 'Jig',
          collectorOrComposer: 'Francis O’Neill (The Dance Music of Ireland, 1907)',
          notes: 'A celebrated double jig in G major preserved by traveling pipers along the Grand and Royal Canals.'
        },
        {
          tuneTitle: 'The College Hornpipe',
          irishTitle: 'Cornphíopa an Choláiste',
          tuneType: 'Hornpipe',
          collectorOrComposer: 'Traditional Leinster Fiddlers',
          notes: 'Vibrant 4/4 hornpipe associated with Maynooth students and canal lock festivities.'
        }
      ]
    },
    climateAndSport: {
      climateEvent: {
        name: 'The Night of the Big Wind (Oíche na Gaoithe Móire)',
        year: '6–7 January 1839',
        phenomenon: 'Category 3 violent hurricane with 100+ mph wind gusts sweeping across Ireland.',
        impactOnSettlement: 'Tore the lead roofs off Maynooth College chapel, uprooted over 500 ancient oak trees in Carton Demesne, and damaged the towers of Maynooth Castle.'
      },
      equineAndGaa: {
        gaaTradition: 'Maynooth GAA (founded 1887) is the home club of Emmy & Oscar-nominated actor Paul Mescal, who captained the Kildare minor Gaelic football team.',
        thoroughbredTradition: 'Carton Demesne hosted the Irish Open golf tournament and historic Duke of Leinster equine studs that trained champion bloodlines.'
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
      },
      {
        id: 'maynooth-mescal-arts',
        title: 'Paul Mescal: From Maynooth GAA Captain to Hollywood Oscar Nominee',
        category: 'art',
        hookSnippet: 'The Maynooth native who conquered global cinema in Normal People and Gladiator II.',
        spokenNarrative: 'Before captivating world cinema in Normal People, Aftersun, and Gladiator Two, Oscar-nominee Paul Mescal grew up right here in Maynooth. Playing cornerback for Maynooth GAA and captaining the Kildare minor football team, Mescal performed on the local school stage before attending The Lir Academy, carrying Kildare pride to the Academy Awards.',
        detailMarkdown: 'Born in Maynooth, County Kildare (1996). Educated at Maynooth Post Primary School. Winner of the Laurence Olivier Award and Academy Award nominee.'
      },
      {
        id: 'maynooth-sorbonne-scholars',
        title: 'The French Sorbonne Refugees & The Carton Francini Ceiling',
        category: 'diaspora',
        hookSnippet: 'How the French Revolution and Italian Swiss masters shaped Maynooth’s art and learning.',
        spokenNarrative: 'Maynooth holds profound European connections. In 1795, professors fleeing the French Revolution at the Sorbonne in Paris arrived here to establish the academic foundation of St. Patrick’s College. Decades earlier in 1739, Swiss-Italian master stuccodores Paolo and Filippo Francini created the breathtaking Saloon ceiling at Carton House, celebrated as the finest Baroque plasterwork in Western Europe.',
        detailMarkdown: 'St. Patrick’s College Archives & Carton House OPW Collection. Exemplifies the deep intellectual and artistic links between Kildare and Continental Europe.'
      },
      {
        id: 'maynooth-cso-university',
        title: 'The Modern Maynooth Surge: Ireland’s Youngest Town & Innovation Hub',
        category: 'demographics',
        hookSnippet: 'CSO 2022 Census data confirms a median age of 28.4 years and 15,000 university students.',
        spokenNarrative: 'From 1,385 residents in the 1911 Census, Maynooth has grown more than eleven-fold to over seventeen thousand residents in 2022. Driven by Maynooth University’s fifteen thousand students and international researchers, the Central Statistics Office records Maynooth as having the youngest median age in Ireland at just 28.4 years, anchoring a multi-million-euro technology transfer ecosystem.',
        detailMarkdown: 'Central Statistics Office (CSO) Census 2022 (DED Maynooth).'
      },
      {
        id: 'maynooth-1916-gpo',
        title: 'The Maynooth Fifteen: Marching to the GPO on Easter Monday 1916',
        category: 'military',
        hookSnippet: 'The only provincial Irish Volunteers to break through Crown lines and fight inside the GPO.',
        spokenNarrative: 'On Easter Monday morning 1916, fifteen men of the Maynooth Volunteer company under Captain Patrick Colgan strapped on their rifles and marched fifteen miles along the railway tracks straight into Dublin city. They reached the General Post Office, greeted by Patrick Pearse and James Connolly, fighting through artillery shelling until the final surrender.',
        detailMarkdown: 'Bureau of Military History (BMH WS 0341 - Patrick Colgan, Captain Maynooth Volunteers).'
      },
      {
        id: 'maynooth-1839-wind',
        title: 'The Night of the Big Wind: The 1839 Hurricane That Tore Kildare',
        category: 'climate',
        hookSnippet: 'Met Éireann archives record the terrifying storm of January 1839.',
        spokenNarrative: 'On the night of January sixth, 1839, the most violent hurricane in Irish history struck. Known as Oíche na Gaoithe Móire—the Night of the Big Wind—it ripped the roof off Maynooth College cloisters, toppled five hundred giant ancient oaks across Carton Demesne, and blew canal boats clean out of the Royal Canal.',
        detailMarkdown: 'Met Éireann Historical Weather Archive & Kildare Archaeological Society.'
      },
      {
        id: 'maynooth-m4-bronze',
        title: 'Railpark 1200 BC: The Bronze Age Settlement Beneath the Motorway',
        category: 'excavation',
        hookSnippet: 'How M4 motorway digs uncovered three-thousand-year-old timber homes and Baltic amber.',
        spokenNarrative: 'Beneath the modern M4 motorway at Railpark, rescue excavations by Transport Infrastructure Ireland revealed a three-thousand-year-old Bronze Age settlement. Archaeologists discovered circular timber roundhouses, ornate bronze sunflower pins, and amber beads imported all the way from the Baltic Sea over three millennia ago.',
        detailMarkdown: 'Transport Infrastructure Ireland (TII) Excavation License 92E0147 & National Museum of Ireland Late Bronze Age Collection.'
      }
    ]
  }
];

