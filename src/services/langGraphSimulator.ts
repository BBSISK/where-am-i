import { AgentTraceStep, EnrichedH3Cell } from '../types';

export interface LangGraphExecutionState {
  h3Index: string;
  currentStepIndex: number;
  totalTokens: number;
  totalLatencyMs: number;
  steps: AgentTraceStep[];
  isComplete: boolean;
  finalPayload: EnrichedH3Cell | null;
}

export class LangGraphSimulator {
  public static async runPipeline(
    cell: EnrichedH3Cell,
    onStepUpdate?: (state: LangGraphExecutionState) => void
  ): Promise<LangGraphExecutionState> {
    const steps: AgentTraceStep[] = [
      {
        nodeName: 'GeoScoutNode',
        agentRole: 'Geospatial Extraction Agent',
        status: 'pending',
        executionTimeMs: 0,
        inputSummary: `H3 Index: ${cell.h3Index} (~0.74 km² cell bounds)`,
        outputSummary: 'Resolved bounding polygon, Overpass OSM POIs, and ASI National Monument records',
        tokensUsed: 65,
        artifactsProduced: ['GeoJSON polygon boundary', '2 Archaeological SMR records']
      },
      {
        nodeName: 'EtymologySieveNode',
        agentRole: 'Placename & Linguistic Agent',
        status: 'pending',
        executionTimeMs: 0,
        inputSummary: `Townland: "${cell.townland}", County: "${cell.county}"`,
        outputSummary: `Irish root analysis: "${cell.etymology.irishName}" (${cell.etymology.phonetic}). Roots: ${cell.etymology.rootWords.map(r => r.root).join(', ')}`,
        tokensUsed: 110,
        artifactsProduced: ['Logainm.ie verified entry', 'Phonetic IPA string', 'Etymological root tree']
      },
      {
        nodeName: 'FolkloreRetrieverNode',
        agentRole: 'Dúchas Archive RAG Agent',
        status: 'pending',
        executionTimeMs: 0,
        inputSummary: `Parish: "${cell.parish}", Category filter: Folklore & Oral Lore`,
        outputSummary: `Matched 1937 Schools' Collection volume (${cell.folklore.duchasVolumeId}): "${cell.folklore.title}"`,
        tokensUsed: 145,
        artifactsProduced: ['Folklore transcription chunk', 'Informant metadata (1937)', 'Confidence score: 0.94']
      },
      {
        nodeName: 'StorytellerSynthesizerNode',
        agentRole: 'Speech Synthesis & UX Script Agent',
        status: 'pending',
        executionTimeMs: 0,
        inputSummary: 'Multi-layer synthesis (Etymology + Archaeology + Folklore + Geology)',
        outputSummary: 'Drafted 35-second ambient audio narration script and 3 driver highlight cards',
        tokensUsed: 195,
        artifactsProduced: ['Audio SSML narrative script', 'Driver glance cards']
      },
      {
        nodeName: 'FactGuardVerifierNode',
        agentRole: 'Deterministic Hallucination & Spatial Guard',
        status: 'pending',
        executionTimeMs: 0,
        inputSummary: 'Evaluating draft narration against primary source coordinate constraints',
        outputSummary: 'VERIFIED: 0 spatial hallucinations, distances within 1km radius, historical dates cross-checked',
        tokensUsed: 45,
        artifactsProduced: ['Guardrails verdict: PASS (Score: 100/100)']
      }
    ];

    const state: LangGraphExecutionState = {
      h3Index: cell.h3Index,
      currentStepIndex: 0,
      totalTokens: 0,
      totalLatencyMs: 0,
      steps,
      isComplete: false,
      finalPayload: null
    };

    // Simulate real step-by-step asynchronous execution
    for (let i = 0; i < steps.length; i++) {
      state.currentStepIndex = i;
      steps[i].status = 'running';
      onStepUpdate?.({ ...state });

      // Artificial asynchronous delay for realistic UI rendering
      const stepDuration = 180 + Math.floor(Math.random() * 120);
      await new Promise(res => setTimeout(res, stepDuration));

      steps[i].status = i === steps.length - 1 ? 'verified' : 'completed';
      steps[i].executionTimeMs = stepDuration;
      state.totalTokens += steps[i].tokensUsed;
      state.totalLatencyMs += stepDuration;

      onStepUpdate?.({ ...state });
    }

    state.isComplete = true;
    state.finalPayload = cell;
    onStepUpdate?.({ ...state });

    return state;
  }
}

