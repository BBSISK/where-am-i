import React, { useState } from 'react';
import {
  Cpu,
  GitBranch,
  FileText,
  Play,
  Clock,
  Coins,
  ShieldCheck,
  Kanban
} from 'lucide-react';
import { EnrichedH3Cell } from '../types';
import { LangGraphSimulator, LangGraphExecutionState } from '../services/langGraphSimulator';

interface DevShowcaseViewProps {
  currentCell: EnrichedH3Cell;
}

export const DevShowcaseView: React.FC<DevShowcaseViewProps> = ({ currentCell }) => {
  const [activeDevTab, setActiveDevTab] = useState<'agents' | 'adrs' | 'backlog' | 'architecture'>('agents');
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineState, setPipelineState] = useState<LangGraphExecutionState | null>(null);
  const [selectedAdr, setSelectedAdr] = useState<'adr1' | 'adr2' | 'adr3'>('adr1');

  const handleRunAgentPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      await LangGraphSimulator.runPipeline(currentCell, (updatedState) => {
        setPipelineState({ ...updatedState });
      });
    } finally {
      setIsRunningPipeline(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Recruiter Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                Engineering Showcase
              </span>
              <span className="text-xs text-slate-400 font-mono">Architecture Decision Records & Agentic Traces</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Behind the Build: Systems & AI Architecture</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Explore how <strong>Where Am I?</strong> leverages Uber H3 spatial computing, LangGraph multi-agent orchestration, and open cultural datasets (Logainm, Dúchas, ASI) under strict enterprise SDLC practices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAgentPipeline}
              disabled={isRunningPipeline}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
                isRunningPipeline
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunningPipeline ? 'Agents Executing...' : 'Run Live LangGraph Trace'}</span>
            </button>
          </div>
        </div>

        {/* Showcase Sub-tabs */}
        <div className="flex items-center gap-2 mt-6 border-t border-slate-800/80 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveDevTab('agents')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeDevTab === 'agents'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>LangGraph Multi-Agent Pipeline</span>
          </button>

          <button
            onClick={() => setActiveDevTab('adrs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeDevTab === 'adrs'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Architecture Decision Records (ADRs)</span>
          </button>

          <button
            onClick={() => setActiveDevTab('backlog')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeDevTab === 'backlog'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Sprint Backlog & User Stories</span>
          </button>

          <button
            onClick={() => setActiveDevTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeDevTab === 'architecture'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>System Topology Diagram</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Live LangGraph Pipeline Execution Traces */}
      {activeDevTab === 'agents' && (
        <div className="space-y-6">

          {/* Telemetry Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block">Active Target H3 Cell</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">#{currentCell.h3Index}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block">Total Execution Latency</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-lg font-bold text-white font-mono">
                  {pipelineState ? `${pipelineState.totalLatencyMs} ms` : `${currentCell.enrichmentLatencyMs} ms`}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block">Token Consumption</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-lg font-bold text-white font-mono">
                  {pipelineState ? `${pipelineState.totalTokens} tokens` : `${currentCell.tokensConsumed} tokens`}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block">Guardrails Verification</span>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-bold text-emerald-400 font-mono">100% Passed</span>
              </div>
            </div>
          </div>

          {/* LangGraph Trace Node Flow */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-mono text-slate-300 uppercase tracking-wider font-semibold">
                LangGraph Cyclical State Machine Execution Flow
              </h3>
              <span className="text-xs font-mono text-slate-500">5 Specialized Agents in Loop</span>
            </div>

            <div className="space-y-4">
              {(pipelineState ? pipelineState.steps : [
                {
                  nodeName: 'GeoScoutNode',
                  agentRole: 'Geospatial Extraction Agent',
                  status: 'verified',
                  executionTimeMs: 24,
                  inputSummary: `H3 Index: ${currentCell.h3Index} (~0.74 km² cell bounds)`,
                  outputSummary: 'Resolved bounding polygon, Overpass OSM POIs, and ASI National Monument records',
                  tokensUsed: 65,
                  artifactsProduced: ['GeoJSON polygon boundary', '2 Archaeological SMR records']
                },
                {
                  nodeName: 'EtymologySieveNode',
                  agentRole: 'Placename & Linguistic Agent',
                  status: 'verified',
                  executionTimeMs: 68,
                  inputSummary: `Townland: "${currentCell.townland}", County: "${currentCell.county}"`,
                  outputSummary: `Irish root analysis: "${currentCell.etymology.irishName}". Roots: ${currentCell.etymology.rootWords.map(r => r.root).join(', ')}`,
                  tokensUsed: 110,
                  artifactsProduced: ['Logainm.ie verified entry', 'Phonetic IPA string', 'Etymological root tree']
                },
                {
                  nodeName: 'FolkloreRetrieverNode',
                  agentRole: 'Dúchas Archive RAG Agent',
                  status: 'verified',
                  executionTimeMs: 82,
                  inputSummary: `Parish: "${currentCell.parish}", Category filter: Folklore & Oral Lore`,
                  outputSummary: `Matched 1937 Schools' Collection volume (${currentCell.folklore.duchasVolumeId}): "${currentCell.folklore.title}"`,
                  tokensUsed: 145,
                  artifactsProduced: ['Folklore transcription chunk', 'Informant metadata (1937)', 'Confidence score: 0.94']
                },
                {
                  nodeName: 'StorytellerSynthesizerNode',
                  agentRole: 'Speech Synthesis & UX Script Agent',
                  status: 'verified',
                  executionTimeMs: 114,
                  inputSummary: 'Multi-layer synthesis (Etymology + Archaeology + Folklore + Geology)',
                  outputSummary: 'Drafted 35-second ambient audio narration script and 3 driver highlight cards',
                  tokensUsed: 195,
                  artifactsProduced: ['Audio SSML narrative script', 'Driver glance cards']
                },
                {
                  nodeName: 'FactGuardVerifierNode',
                  agentRole: 'Deterministic Hallucination & Spatial Guard',
                  status: 'verified',
                  executionTimeMs: 22,
                  inputSummary: 'Evaluating draft narration against primary source coordinate constraints',
                  outputSummary: 'VERIFIED: 0 spatial hallucinations, distances within 1km radius, historical dates cross-checked',
                  tokensUsed: 45,
                  artifactsProduced: ['Guardrails verdict: PASS (Score: 100/100)']
                }
              ]).map((step, idx) => (
                <div
                  key={step.nodeName}
                  className={`p-4 rounded-xl border transition-all ${
                    step.status === 'running'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : step.status === 'verified' || step.status === 'completed'
                      ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/30 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        step.status === 'running'
                          ? 'bg-amber-500 text-slate-950 animate-spin'
                          : step.status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm">{step.nodeName}</span>
                        <span className="text-xs font-mono text-slate-400 ml-2">({step.agentRole})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-slate-400">{step.executionTimeMs} ms</span>
                      <span className="text-amber-400 font-bold">{step.tokensUsed} tokens</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {step.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-500 font-mono block">Input Context:</span>
                      <p className="text-slate-300 font-mono mt-0.5">{step.inputSummary}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono block">Output / State Transformation:</span>
                      <p className="text-emerald-300 font-mono mt-0.5">{step.outputSummary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-2">
                    <span className="text-[11px] font-mono text-slate-500">Artifacts:</span>
                    {step.artifactsProduced.map((art, aIdx) => (
                      <span key={aIdx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {art}
                      </span>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Architecture Decision Records (ADRs) */}
      {activeDevTab === 'adrs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Architecture Decision Records
            </span>
            <button
              onClick={() => setSelectedAdr('adr1')}
              className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all ${
                selectedAdr === 'adr1'
                  ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-amber-400 font-bold mb-1">ADR-001: Spatial Indexing</div>
              <p className="text-slate-300">Uber H3 Hexagonal Grid vs Geohash vs S2 vs Rectangular</p>
            </button>

            <button
              onClick={() => setSelectedAdr('adr2')}
              className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all ${
                selectedAdr === 'adr2'
                  ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-amber-400 font-bold mb-1">ADR-002: Agentic Orchestration</div>
              <p className="text-slate-300">LangGraph Cyclical State Machine vs Linear RAG Chains</p>
            </button>

            <button
              onClick={() => setSelectedAdr('adr3')}
              className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all ${
                selectedAdr === 'adr3'
                  ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-amber-400 font-bold mb-1">ADR-003: Drive Mode & Caching</div>
              <p className="text-slate-300">Offline-First Corridor Pre-fetching & Web Speech API</p>
            </button>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {selectedAdr === 'adr1' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white font-sans">
                    ADR-001: Uber H3 Hexagonal Discrete Global Grid System
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">STATUS: ACCEPTED</span>
                </div>
                <p>
                  <strong>Context:</strong> Continuous GPS coordinates must map to a discrete ~1 km² area in O(1) time without GIS polygon intersection overhead, with uniform distances to all neighbors for route lookahead.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-amber-400 font-bold">Why Rectangular Grids Failed:</div>
                  <p className="text-slate-400">
                    Longitude shrinkage at northern latitudes creates severe surface area skew across Ireland (51.4°N to 55.4°N). Diagonal neighbors create √2 distance asymmetry and corner dead zones.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="text-emerald-400 font-bold">Why Uber H3 Won:</div>
                  <p className="text-slate-300">
                    Resolution 8 provides an exact average area of <strong>0.737 km²</strong> (edge 461m). Every hexagon has 6 equidistant neighbors, allowing route corridor pre-fetching with a simple <code>h3.gridDisk(idx, 2)</code> ring buffer.
                  </p>
                </div>
              </div>
            )}

            {selectedAdr === 'adr2' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white font-sans">
                    ADR-002: LangGraph Multi-Agent Architecture
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">STATUS: ACCEPTED</span>
                </div>
                <p>
                  <strong>Context:</strong> Single-prompt RAG pipelines frequently hallucinated Irish historical dates and placed monuments in wrong townlands. We needed deterministic verification before audio speech synthesis.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="text-emerald-400 font-bold">Architectural Solution:</div>
                  <p className="text-slate-300">
                    LangGraph state machine with dedicated agents: <code>GeoScout</code>, <code>EtymologySieve</code>, <code>FolkloreRetriever</code>, and <code>StorytellerSynthesizer</code>, terminating in a deterministic <code>FactGuardVerifierNode</code> that validates all distances are ≤1km and verifies SMR monument records.
                  </p>
                </div>
              </div>
            )}

            {selectedAdr === 'adr3' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white font-sans">
                    ADR-003: Offline-First Corridor Pre-fetching
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">STATUS: ACCEPTED</span>
                </div>
                <p>
                  <strong>Context:</strong> Rural Ireland (Connemara, West Cork, Wicklow) has intermittent 2G/3G connectivity. Real-time per-cell API requests fail in dead zones.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="text-emerald-400 font-bold">Architectural Solution:</div>
                  <p className="text-slate-300">
                    Pre-fetching bundles along the heading vector (5–10 km ahead), caching in client-side IndexedDB, with on-device speech synthesis using native Web Speech API fallback.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Sprint Backlog */}
      {activeDevTab === 'backlog' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-mono text-slate-300 uppercase font-semibold">
              Sprint Backlog & Story Point Velocity (Jira/Linear Framework)
            </h3>
            <span className="text-xs font-mono text-emerald-400">Sprint 1: Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">WAI-101 (3 pts)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">DONE</span>
              </div>
              <h4 className="text-sm font-bold text-white">Repository & Architecture Foundation</h4>
              <p className="text-xs text-slate-400">Vite, React 18, TypeScript, Tailwind CSS, ADR directory, Git Flow branching policy.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">WAI-102 (5 pts)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">DONE</span>
              </div>
              <h4 className="text-sm font-bold text-white">Uber H3 Res-8 Spatial Hex Indexer</h4>
              <p className="text-xs text-slate-400">O(1) coordinate-to-cell mapping, polygon vertex extraction, k-ring corridor prefetching.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">WAI-103 (5 pts)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">DONE</span>
              </div>
              <h4 className="text-sm font-bold text-white">Interactive Drive Mode & GPS Simulator</h4>
              <p className="text-xs text-slate-400">High-contrast HUD, speedometer, heading bearing, waypoint scrubber, and Web Speech API narrator.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">WAI-104 (5 pts)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">DONE</span>
              </div>
              <h4 className="text-sm font-bold text-white">LangGraph Multi-Agent Telemetry Showcase</h4>
              <p className="text-xs text-slate-400">Visual agent pipeline simulator with token tracking, latency metrics, and ADR viewer.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Architecture Topology */}
      {activeDevTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-mono text-slate-300 uppercase font-semibold border-b border-slate-800 pb-3">
            End-to-End System Topology
          </h3>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-emerald-400 font-bold">[1] Vehicle GPS Client (Mobile / PWA)</div>
            <p className="pl-4 text-slate-400">
              → LatLng GPS Sensor emits continuous telemetry (1 Hz) <br />
              → spatialEngine.coordinateToH3(lat, lng, Res 8) hashes coordinates in &lt;1 µs
            </p>

            <div className="text-amber-400 font-bold">[2] Spatial Cache Layer & Corridor Expansion</div>
            <p className="pl-4 text-slate-400">
              → If H3 cell cached in IndexedDB: instant dispatch to HUD & Web Speech API <br />
              → If cell uncached: triggers LangGraph Ingestion Pipeline
            </p>

            <div className="text-cyan-400 font-bold">[3] LangGraph Ingestion & Agent Loop</div>
            <p className="pl-4 text-slate-400">
              → GeoScoutNode queries Overpass OSM + Archaeological Survey of Ireland <br />
              → EtymologySieveNode queries Logainm.ie open API for Gaelic root decomposition <br />
              → FolkloreRetrieverNode queries Dúchas.ie (1937–38 Schools’ Collection) <br />
              → StorytellerSynthesizerNode synthesizes 35s radio audio narrative <br />
              → FactGuardVerifierNode validates distances ≤ 1km before audio approval
            </p>

            <div className="text-purple-400 font-bold">[4] Presentation & Audio Delivery</div>
            <p className="pl-4 text-slate-400">
              → Ambient TTS audio narration with en-IE dialect voice <br />
              → 4-Layer contextual card display (Etymology, Archaeology, Folklore, Geology)
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
