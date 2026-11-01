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

export interface ThreadOption {
  id: string;
  title: string;
  category: 'folklore' | 'monument' | 'etymology' | 'geology' | 'history' | 'waterways';
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
  category: 'folklore' | 'monument' | 'etymology' | 'geology' | 'history' | 'waterways';
  spokenNarrative: string;
}

export interface EnrichedH3Cell {
  h3Index: string;
  center: GeoCoordinate;
  townland: string;
  parish: string;
  county: string;
  etymology: EtymologyInfo;
  monuments: NationalMonument[];
  folklore: FolkloreStory;
  geology: GeologicalFeature;
  history?: HistoryEvent;
  waterways?: WaterwayInfo;
  councilSource?: CouncilHeritageSource;
  teaserScript: string; // 10-second ambient audio teaser breadcrumb
  narrativeScript: string; // Full audio script
  threads: ThreadOption[]; // Interactive threads to pull
  keyHighlights: string[]; // 3 punchy bullet points
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
