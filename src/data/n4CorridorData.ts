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
        description: 'Palladian villa designed by Agostino Carlini (1772) incorporating the remains of the medieval tower house of Patrick Sarsfield, 1st Earl of Lucan.',
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
    teaserScript: 'Crossing into Lucan along the River Liffey. Ancestral manor of Patrick Sarsfield, home to Dublin’s oldest 12th-century stone bridge, and a famous 1758 geothermal spa. Say "Tell Me More" or tap a thread to explore.',
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
        name: 'Maynooth Castle',
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
      }
    ]
  }
];

