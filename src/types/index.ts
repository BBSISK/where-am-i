export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface EtymologyInfo {
  irishName: string;
  englishName: string;
  phonetic: string;
  rootWords: {
    root: string;
    meaning: string;
  }[];
  explanation: string;
  source: string; // e.g., "Logainm.ie Placenames Commission"
}

export interface NationalMonument {
  id: string;
  name: string;
  type: 'Ringfort' | 'Castle' | 'Standing Stone' | 'Holy Well' | 'Cairn' | 'Crannóg' | 'Abbey';
  era: 'Neolithic' | 'Bronze Age' | 'Early Christian' | 'Medieval' | '17th Century' | '18th Century' | '19th Century' | 'Modern';
  distanceMeters: number;
  description: string;
  smrNumber: string; // Sites & Monuments Record ID
}

export interface FolkloreStory {
  title: string;
  informant: string;
  schoolName: string;
  parish: string;
  county: string;
  yearRecorded: number; // 1937 or 1938
  storySnippet: string;
  category: 'Fairy Lore' | 'Hidden Treasure' | 'Holy Wells' | 'Famine Memory' | 'Local Hero' | 'Ghost/Banshee';
  duchasVolumeId: string;
}

export interface GeologicalFeature {
  name: string;
  type: 'Esker' | 'Karst Limestone' | 'Peat Bog' | 'Glacial Valley' | 'Drumlin' | 'Sea Cliff';
  ageEpoch: string; // e.g., "Pleistocene (Ice Age)"
  scientificInsight: string;
}

export interface HistoryEvent {
  title: string;
  era: string;
  figure: string;
  narrative: string;
}

export interface WaterwayInfo {
  name: string;
  type: 'River' | 'Canal' | 'Spa Spring' | 'Estuary' | 'Lake';
  significance: string;
}

export interface CouncilHeritageSource {
  councilName: string; // e.g. "South Dublin County Council (SDCC)"
  trailName: string; // e.g. "Lucan Heritage Trail & SDCC Heritage Walks"
  historicalSociety: string; // e.g. "Society for Old Lucan (SOL)"
  archiveCitation: string; // e.g. "South Dublin Libraries Local Studies Collection"
  keyHighlights: string[];
}

export interface CensusDemographics {
  censusYear: 1911;
  totalPopulation: number;
  inhabitedHouses: number;
  roofTypes: { slateOrTile: number; thatchOrWood: number };
  literacyRatePct: number;
  irishSpeakersCount: number;
  topOccupations: string[];
  notableHouseholds: string[];
  famineImpact: {
    pop1841: number;
    pop1851: number;
    changePct: string;
    narrative: string;
  };
  griffithsValuation: {
    yearRecorded: number;
    primaryLessor: string;
    tenementCount: number;
    predominantFamilyNames: string[];
    annualValuationPounds: string;
  };
  downSurvey1656?: {
    parish1641: string;
    catholicLandowner1641: string;
    cromwellianGrantee1656: string;
    terrainNotes: string;
  };
}

export interface ArtReference {
  id: string;
  artist: string;
  artistLifespan?: string;
  artworkTitle: string;
  yearCreated: string;
  medium: string;
  galleryOrCollection: string; // e.g. "National Gallery of Ireland (NGI)", "National Library of Ireland (NLI)", "Carton House / OPW"
  catalogRef?: string; // e.g. "NGI.4363"
  description: string;
  culturalSignificance: string;
}

export interface CommunityDiasporaLink {
  id: string;
  communityName: string; // e.g. "The Italian Diplomatic & Cultural Connection — Parco Italia"
  connectionEra: string; // e.g. "1954–Present / 18th Century"
  flagEmoji: string; // e.g. "🇮🇹" or "🇳🇴" or "🇫🇷"
  summary: string;
  narrative: string;
  keyFiguresOrMilestones: string[];
}

export interface CsoModernMetrics {
  censusYear: 2022;
  population2022: number;
  growthFrom1911Pct: string; // e.g. "+7,169%"
  households2022: number;
  broadbandCoveragePct: number;
  demographicProfile: string;
  economicDrivers: string[];
  infrastructureMilestones: string[];
}

export interface FamousFigure {
  name: string;
  lifespan: string;
  category: 'Arts & Culture' | 'Science & Innovation' | 'Military & Politics' | 'Industry & Enterprise';
  significance: string;
  quoteOrLegacy: string;
}

export interface NiahBuiltHeritage {
  regNumber: string; // e.g. "11202008"
  name?: string;
  buildingName?: string;
  originalUse?: string;
  category?: string;
  yearBuilt?: string;
  datePeriod?: string;
  rating: 'National' | 'Regional' | 'Local' | string;
  architecturalStyle?: string;
  description: string;
  appraisal?: string;
}

export interface BiodiversityEcology {
  sacName?: string; // e.g. "Rye Water Valley / Carton SAC (Site Code 001398)"
  sacOrSpa?: string;
  designationType?: string;
  habitats?: string[];
  indicatorSpecies: Array<{
    commonName: string;
    irishName?: string;
    scientificName: string;
    status: string;
    notes: string;
  }>;
  conservationNotes: string;
}

export interface MilitaryWitnessStatement {
  bureauRef: string; // e.g. "BMH WS 0768"
  witnessName: string;
  unitOrBrigade: string; // e.g. "4th Battalion, Dublin Brigade IRA"
  period: string; // e.g. "1916–1921 (War of Independence)"
  summary: string;
  eyewitnessExcerpt: string;
  historicalContext: string;
}

export interface MotorwayArchaeology {
  siteName: string;
  excavationLicense: string; // e.g. "04E0911"
  roadScheme: string; // e.g. "N4 Lucan Bypass / M4 Kilcock-Maynooth Motorway Scheme"
  period: string;
  discovery: string;
  museumArtifacts?: string[];
}

export interface LiteraryAndMusicRecord {
  literaryReferences: Array<{
    author: string;
    workTitle: string;
    yearPublished?: string;
    excerptOrTheme: string;
    geographicalTie: string;
  }>;
  traditionalMusic?: Array<{
    tuneTitle: string;
    irishTitle?: string;
    tuneType: 'Reel' | 'Jig' | 'Hornpipe' | 'Air' | 'Harp Planxty';
    collectorOrComposer?: string;
    notes: string;
  }>;
}

export interface ClimateAndSportHeritage {
  climateEvent?: {
    name: string; // e.g. "The Great Frost of 1739–1740 & Frozen Liffey"
    year: string;
    phenomenon: string;
    impactOnSettlement: string;
  };
  equineAndGaa?: {
    gaaTradition: string;
    thoroughbredTradition?: string;
  };
}

/** One image per item, only from an exact record join; always credited and linked to its record. */
export interface ThreadImage {
  url: string;
  alt: string;
  credit: string;
  licence: string;
  sourceUrl: string;
  sourceId: string;
  /** What the photo actually shows (e.g. one building in a story about a whole street). */
  depicts?: string;
}

export interface ThreadOption {
  id: string;
  image?: ThreadImage;
  title: string;
  category: 'folklore' | 'monument' | 'etymology' | 'geology' | 'history' | 'waterways' | 'art' | 'diaspora' | 'demographics' | 'architecture' | 'ecology' | 'military' | 'excavation' | 'literature' | 'music' | 'climate';
  hookSnippet: string;
  spokenNarrative: string;
  detailMarkdown: string;
}

export interface SavedTripThread {
  id: string;
  timestamp: string;
  h3Index: string;
  townland: string;
  threadTitle: string;
  category: 'folklore' | 'monument' | 'etymology' | 'geology' | 'history' | 'waterways' | 'art' | 'diaspora' | 'demographics' | 'architecture' | 'ecology' | 'military' | 'excavation' | 'literature' | 'music' | 'climate';
  spokenNarrative: string;
}

export interface EnrichedH3Cell {
  h3Index: string;
  center: GeoCoordinate;
  /** Stable id of the area this cell belongs to (one teaser per area per trip). Absent = unknown area. */
  areaId?: string;
  /** 'town' teasers always win; townland/place teasers wait for the quiet gap. */
  areaKind?: 'town' | 'townland' | 'place';
  /** True when this area lies in a built-up area: townland teasers are not spoken there. */
  inBuiltUpArea?: boolean;
  townland: string;
  parish: string;
  county: string;
  // Rich layers are OPTIONAL: they appear only once a verified pipeline supplies them with sources.
  etymology?: EtymologyInfo;
  monuments: NationalMonument[];
  folklore?: FolkloreStory;
  geology?: GeologicalFeature;
  history?: HistoryEvent;
  waterways?: WaterwayInfo;
  councilSource?: CouncilHeritageSource;
  census?: CensusDemographics;
  artReferences?: ArtReference[];
  communityLinks?: CommunityDiasporaLink[];
  csoModern?: CsoModernMetrics;
  famousFigures?: FamousFigure[];
  niahHeritage?: NiahBuiltHeritage[];
  biodiversity?: BiodiversityEcology;
  militaryWitnesses?: MilitaryWitnessStatement[];
  motorwayArchaeology?: MotorwayArchaeology[];
  literaryAndMusic?: LiteraryAndMusicRecord;
  climateAndSport?: ClimateAndSportHeritage;
  teaserScript: string; // 10-second ambient audio teaser breadcrumb
  narrativeScript: string; // Full audio script
  threads: ThreadOption[]; // Interactive threads to pull
  /** Image shown with the area teaser: the first thread image, captioned with what it shows. */
  teaserImage?: { image: ThreadImage; subject: string };
  keyHighlights: string[]; // 3 punchy bullet points
  /** Every source behind what this cell displays or speaks. Empty means: say nothing beyond the place name. */
  sources: SourceRef[];
  curatedByAgent: boolean;
  enrichmentLatencyMs: number;
  tokensConsumed: number;
}

export interface RouteWaypoint {
  coordinate: GeoCoordinate;
  name: string;
  roadName: string;
  speedLimitKmh: number;
}

export interface SimulatedRoute {
  id: string;
  title: string;
  region: string;
  description: string;
  distanceKm: number;
  estimatedDriveTime: string;
  waypoints: RouteWaypoint[];
}

export interface AgentTraceStep {
  nodeName: string;
  agentRole: string;
  status: 'pending' | 'running' | 'completed' | 'verified' | 'failed';
  executionTimeMs: number;
  inputSummary: string;
  outputSummary: string;
  tokensUsed: number;
  artifactsProduced: string[];
}

/** A citation for something the app displays or speaks. */
export interface SourceRef {
  id: string;          // stable id, e.g. 'osm-nominatim', 'logainm:31975'
  name: string;        // human-readable source name
  url?: string;        // link to the record or dataset
  licence: string;     // e.g. 'ODbL 1.0', 'CC BY 4.0'
  attribution: string; // exact attribution text required by the licence
}
