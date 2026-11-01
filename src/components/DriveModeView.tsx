import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Compass,
  Radio,
  BookOpen,
  Castle,
  Sparkles,
  Mountain,
  Volume2,
  ChevronRight
} from 'lucide-react';
import { EnrichedH3Cell, SimulatedRoute } from '../types';

interface DriveModeViewProps {
  currentRoute: SimulatedRoute;
  onRouteChange: (routeId: string) => void;
  availableRoutes: SimulatedRoute[];
  currentWaypointIndex: number;
  totalWaypoints: number;
  currentCell: EnrichedH3Cell;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  isSpeaking: boolean;
  onReplayAudio: () => void;
  bearing: number;
  onSelectWaypoint: (index: number) => void;
}

export const DriveModeView: React.FC<DriveModeViewProps> = ({
  currentRoute,
  onRouteChange,
  availableRoutes,
  currentWaypointIndex,
  totalWaypoints,
  currentCell,
  isPlaying,
  onTogglePlay,
  onReset,
  playbackSpeed,
  onSpeedChange,
  isSpeaking,
  onReplayAudio,
  bearing,
  onSelectWaypoint
}) => {
  const [activeCardTab, setActiveCardTab] = useState<'etymology' | 'monuments' | 'folklore' | 'geology'>('etymology');
  const activeWaypoint = currentRoute.waypoints[currentWaypointIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Top Driving Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Route Selector & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">Active GPS Corridor</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400">{currentRoute.region}</span>
            </div>
            <select
              value={currentRoute.id}
              onChange={(e) => onRouteChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-sm sm:text-base py-1 px-2.5 mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {availableRoutes.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Playback & Driving Simulator Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause Driving' : 'Start Driving'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="Reset Route"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Multiplier */}
          <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1 text-xs font-mono">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main HUD: Speed, Heading, H3 Hex, and Audio Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Vehicle Telemetry & Active H3 Cell ID */}
        <div className="space-y-6">

          {/* Vehicular HUD Card */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Vehicle Telemetry</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>GPS Locked</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-slate-400 font-mono">Simulated Speed</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {isPlaying ? Math.round(activeWaypoint.speedLimitKmh * 0.95) : 0}
                  </span>
                  <span className="text-xs font-bold text-slate-400">km/h</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-mono">Heading</p>
                <div className="flex items-center gap-2 mt-1">
                  <Compass className="w-6 h-6 text-emerald-400" style={{ transform: `rotate(${bearing}deg)` }} />
                  <div>
                    <span className="text-2xl font-bold text-white tracking-tight">{Math.round(bearing)}°</span>
                    <span className="text-xs text-slate-400 block font-mono">
                      {bearing > 315 || bearing <= 45 ? 'North' : bearing <= 135 ? 'East' : bearing <= 225 ? 'South' : 'West'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Spatial Grid Cell */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Uber H3 Spatial Cell (Res 8)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">~0.74 km²</span>
              </div>
              <div className="mt-1.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-sm font-bold text-emerald-400 tracking-wider">#{currentCell.h3Index}</span>
                <span className="text-xs text-slate-500">O(1) Indexed</span>
              </div>
            </div>

            {/* Current Location Badge */}
            <div className="mt-4">
              <p className="text-xs text-slate-400 font-mono">Current Townland & Road</p>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeWaypoint.name}</h3>
              <p className="text-xs font-mono text-emerald-400 mt-0.5">{activeWaypoint.roadName}</p>
            </div>

          </div>

          {/* Route Progress Waypoint Scrubber */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Corridor Milestones</span>
              <span className="text-xs font-mono text-emerald-400">
                {currentWaypointIndex + 1} of {totalWaypoints}
              </span>
            </div>

            <div className="space-y-2">
              {currentRoute.waypoints.map((wp, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectWaypoint(idx)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    idx === currentWaypointIndex
                      ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                      : idx < currentWaypointIndex
                      ? 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white'
                      : 'bg-slate-950/20 border-slate-800/40 text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${idx === currentWaypointIndex ? 'bg-emerald-400 animate-pulse' : idx < currentWaypointIndex ? 'bg-emerald-700' : 'bg-slate-700'}`}></span>
                    <span className="truncate max-w-[200px]">{wp.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Spoken Audio Narration & Multi-Layer Heritage Card */}
        <div className="lg:col-span-2 space-y-6">

          {/* Ambient Spoken Audio Narration Box */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Radio className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-emerald-300' : 'opacity-60'}`} />
                <span>Ambient Audio Tour Guide (Radio Éire)</span>
                {isSpeaking && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono animate-pulse">
                    Broadcasting
                  </span>
                )}
              </div>

              <button
                onClick={onReplayAudio}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Replay Narration</span>
              </button>
            </div>

            {/* Narrative Text */}
            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-serif italic">
              "{currentCell.narrativeScript}"
            </p>

            {/* 3 Quick Driver Highlights */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentCell.keyHighlights.map((hl, i) => (
                <div key={i} className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rich Cultural Knowledge Explorer Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            
            {/* Tabs for Data Layers */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
              <button
                onClick={() => setActiveCardTab('etymology')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeCardTab === 'etymology'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Placename Etymology (Logainm)</span>
              </button>

              <button
                onClick={() => setActiveCardTab('monuments')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeCardTab === 'monuments'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Castle className="w-4 h-4" />
                <span>National Monuments ({currentCell.monuments.length})</span>
              </button>

              <button
                onClick={() => setActiveCardTab('folklore')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeCardTab === 'folklore'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Folklore & Legends (Dúchas)</span>
              </button>

              <button
                onClick={() => setActiveCardTab('geology')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeCardTab === 'geology'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Mountain className="w-4 h-4" />
                <span>Geology (GSI)</span>
              </button>
            </div>

            {/* Tab Content Display */}
            <div className="p-6">

              {/* Tab 1: Etymology */}
              {activeCardTab === 'etymology' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 uppercase">Gaeilge (Irish Gaelic)</span>
                      <h4 className="text-2xl font-black text-white">{currentCell.etymology.irishName}</h4>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        Phonetic pronunciation: <span className="text-amber-400 font-bold">{currentCell.etymology.phonetic}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400">Anglicized Form</span>
                      <p className="text-lg font-bold text-slate-200">{currentCell.etymology.englishName}</p>
                    </div>
                  </div>

                  {/* Root words breakdown */}
                  <div>
                    <h5 className="text-xs font-mono text-slate-400 uppercase mb-2">Linguistic Root Decomposition</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentCell.etymology.rootWords.map((root, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-emerald-400 font-bold font-mono text-sm">{root.root}</span>
                          <p className="text-xs text-slate-300 mt-1">{root.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {currentCell.etymology.explanation}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2">
                    <span>Source: {currentCell.etymology.source}</span>
                    <span className="text-emerald-500">Official Open Data</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Monuments */}
              {activeCardTab === 'monuments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-mono text-slate-400 uppercase">
                      Archaeological Survey of Ireland (ASI) Sites in this Cell
                    </h4>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      National Monuments Service
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {currentCell.monuments.map((m) => (
                      <div key={m.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-bold font-mono">
                              {m.type}
                            </span>
                            <span className="text-xs font-mono text-slate-500">{m.era}</span>
                          </div>
                          <span className="text-xs font-mono text-emerald-400 font-semibold">
                            {m.distanceMeters}m from route
                          </span>
                        </div>
                        <h5 className="text-base font-bold text-white">{m.name}</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>
                        <div className="text-right text-[10px] font-mono text-slate-500">
                          SMR ID: {m.smrNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Folklore */}
              {activeCardTab === 'folklore' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-mono text-amber-400 uppercase">National Folklore Collection (1937–38)</span>
                      <h4 className="text-lg font-bold text-white">{currentCell.folklore.title}</h4>
                    </div>
                    <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/20">
                      {currentCell.folklore.category}
                    </span>
                  </div>

                  <blockquote className="p-4 rounded-xl bg-slate-950 border-l-4 border-amber-500 text-sm text-slate-300 italic leading-relaxed">
                    "{currentCell.folklore.storySnippet}"
                  </blockquote>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-400">
                    <div>
                      <span className="text-slate-600 block">Informant:</span>
                      <span className="text-slate-200">{currentCell.folklore.informant}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">School:</span>
                      <span className="text-slate-200">{currentCell.folklore.schoolName}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Year Recorded:</span>
                      <span className="text-emerald-400 font-bold">{currentCell.folklore.yearRecorded}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Dúchas Archive:</span>
                      <span className="text-slate-200">{currentCell.folklore.duchasVolumeId}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Geology */}
              {activeCardTab === 'geology' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 uppercase">Geological Survey Ireland (GSI)</span>
                      <h4 className="text-lg font-bold text-white">{currentCell.geology.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                      {currentCell.geology.type}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-mono text-amber-400">
                      Geological Epoch: {currentCell.geology.ageEpoch}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {currentCell.geology.scientificInsight}
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
