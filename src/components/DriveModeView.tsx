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
  ChevronRight,
  Bookmark,
  ArrowRight,
  Satellite,
  ShieldAlert,
  Sun,
  Activity,
  Mic,
  MicOff
} from 'lucide-react';
import { EnrichedH3Cell, SimulatedRoute, ThreadOption } from '../types';
import { RealGpsState } from '../services/realGpsService';
import { VoiceCommandState } from '../services/voiceCommandService';

interface DriveModeViewProps {
  // GPS & Driving Modes
  drivingMode: 'real-gps' | 'simulator';
  setDrivingMode: (mode: 'real-gps' | 'simulator') => void;
  gpsState: RealGpsState;
  onStartGps: () => void;
  onStopGps: () => void;

  // Voice & Audio Status
  voiceState: VoiceCommandState;
  hasElevenApiKey: boolean;
  audioLastError: string | null;
  onOpenVoiceStudio: () => void;

  // Simulator props (Secondary mode)
  currentRoute: SimulatedRoute;
  onRouteChange: (routeId: string) => void;
  availableRoutes: SimulatedRoute[];
  currentWaypointIndex: number;
  totalWaypoints: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onSelectWaypoint: (index: number) => void;

  // Shared HUD & Thread props
  currentCell: EnrichedH3Cell;
  isSpeaking: boolean;
  onReplayAudio: () => void;
  bearing: number;
  speedKmh: number;
  onPullThread: (thread: ThreadOption) => void;
  activeThread: ThreadOption | null;
  onOpenScrapbook: () => void;
  savedThreadsCount: number;
}

export const DriveModeView: React.FC<DriveModeViewProps> = ({
  drivingMode,
  setDrivingMode,
  gpsState,
  onStartGps,
  onStopGps,
  voiceState,
  hasElevenApiKey,
  audioLastError,
  onOpenVoiceStudio,
  currentRoute,
  onRouteChange,
  availableRoutes,
  currentWaypointIndex,
  totalWaypoints,
  isPlaying,
  onTogglePlay,
  onReset,
  playbackSpeed,
  onSpeedChange,
  onSelectWaypoint,
  currentCell,
  isSpeaking,
  onReplayAudio,
  bearing,
  speedKmh,
  onPullThread,
  activeThread,
  onOpenScrapbook,
  savedThreadsCount
}) => {
  const [activeCardTab, setActiveCardTab] = useState<'etymology' | 'monuments' | 'folklore' | 'geology'>('etymology');
  const isGpsLocked = gpsState.status === 'locked';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Top Mode Selector Bar: Real GPS vs Simulator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-xl">
        
        {/* Primary Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setDrivingMode('real-gps')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              drivingMode === 'real-gps'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Satellite className="w-4 h-4 text-emerald-300" />
            <span>🛰️ Live Vehicle GPS (Primary)</span>
          </button>

          <button
            onClick={() => setDrivingMode('simulator')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              drivingMode === 'simulator'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-300" />
            <span>Demo Simulator</span>
          </button>
        </div>

        {/* Scrapbook Button */}
        <button
          onClick={onOpenScrapbook}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-xs font-mono font-bold transition-all"
        >
          <Bookmark className="w-4 h-4 text-emerald-400" />
          <span>Trip Scrapbook</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
            {savedThreadsCount}
          </span>
        </button>

      </div>

      {/* Mode-Specific Action Controller */}
      {drivingMode === 'real-gps' ? (
        /* Real GPS Dashboard Controller */
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              isGpsLocked
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <Satellite className={`w-6 h-6 ${isGpsLocked ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono font-bold text-emerald-400">Hardware GPS Tracking</span>
                {isGpsLocked && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Accuracy: ±{gpsState.accuracyMeters}m
                  </span>
                )}
                {gpsState.isScreenWakeLocked && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 flex items-center gap-1 border border-amber-500/20">
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Screen Awake</span>
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {isGpsLocked
                  ? `${currentCell.townland} (${currentCell.county})`
                  : gpsState.status === 'requesting'
                  ? 'Acquiring Satellite Lock...'
                  : 'Ready to drive in real life'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {isGpsLocked ? (
              <button
                onClick={onStopGps}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-rose-600/20"
              >
                Stop GPS Tracking
              </button>
            ) : (
              <button
                onClick={onStartGps}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all"
              >
                <Satellite className="w-5 h-5 fill-current" />
                <span>Start Live GPS Driving</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Simulator Controller */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">Demo Simulation Corridor</span>
              <select
                value={currentRoute.id}
                onChange={(e) => onRouteChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-sm sm:text-base py-1 px-2.5 mt-1 focus:ring-2 focus:ring-amber-500 focus:outline-none block"
              >
                {availableRoutes.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

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
              <span>{isPlaying ? 'Pause Demo' : 'Play Demo'}</span>
            </button>

            <button
              onClick={onReset}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1 text-xs font-mono">
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    playbackSpeed === speed ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GPS Error Alert */}
      {gpsState.status === 'error' && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{gpsState.errorMessage}</span>
        </div>
      )}

      {/* Voice Copilot & Ambient Driver Interaction */}
      <div className="space-y-2">
        {/* Dynamic Voice Command Triggers */}
        {voiceState.commandDetected === 'wake_word' && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-slate-900 to-slate-900 border border-emerald-400 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xl animate-pulse">
            <span className="text-xl">☘️</span>
            <span>Wake Word Recognized: "Hey Anseo" — Listening! Say "Where am I" or "Tell me more".</span>
          </div>
        )}

        {voiceState.commandDetected === 'where_am_i' && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-slate-900 to-slate-900 border border-cyan-400 text-cyan-200 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xl animate-pulse">
            <Compass className="w-5 h-5 text-cyan-300 shrink-0" />
            <span>Voice Command: "Where Am I?" — Announcing {currentCell.townland}, Co. {currentCell.county}!</span>
          </div>
        )}

        {voiceState.commandDetected === 'tell_me_more' && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-slate-900 border border-amber-400 text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xl animate-pulse">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span>Voice Command: "Tell Me More" — Unfolding authentic Irish heritage thread!</span>
          </div>
        )}

        {/* Automatic Hands-Free Voice Copilot Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:px-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              voiceState.isListening
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {voiceState.isListening ? (
                <Mic className="w-4 h-4 animate-pulse text-emerald-400" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${voiceState.isListening ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {voiceState.isListening ? '🎙️ Automatic Voice Copilot Active' : '🎙️ Voice Copilot Ready'}
                </span>
                {voiceState.isListening && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Always hands-free: Say <strong className="text-amber-300">"Hey Anseo"</strong> • <strong className="text-cyan-300">"Where am I"</strong> • <strong className="text-emerald-300">"Tell me more"</strong> • <strong className="text-slate-300">"Stop"</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            {voiceState.lastHeardPhrase && (
              <span className="text-[10px] text-slate-300 italic bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 truncate max-w-[200px]">
                Heard: "{voiceState.lastHeardPhrase}"
              </span>
            )}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {voiceState.isListening ? 'Continuous Listening' : 'Auto-starts with drive'}
            </span>
          </div>
        </div>

        {/* ElevenLabs High-Fidelity Audio Indicator */}
        {audioLastError ? (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Audio notice: {audioLastError}. Using native device speech.</span>
            </div>
          </div>
        ) : hasElevenApiKey ? (
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>ElevenLabs High-Fidelity Irish AI Storyteller Active</span>
            </div>
            <button
              onClick={onOpenVoiceStudio}
              className="text-slate-400 hover:text-white text-[11px] underline"
            >
              Voice Settings
            </button>
          </div>
        ) : (
          <div className="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center justify-between font-mono">
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Native Audio Synthesis Engine Active</span>
            </div>
            <button
              onClick={onOpenVoiceStudio}
              className="text-slate-400 hover:text-white text-[11px] underline"
            >
              Voice Settings
            </button>
          </div>
        )}
      </div>

      {/* Main Vehicular HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Speedometer, Heading, H3 Hex, and Distance */}
        <div className="space-y-6">

          {/* Speed & Heading HUD */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {drivingMode === 'real-gps' ? 'Live Telemetry' : 'Simulated Telemetry'}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{drivingMode === 'real-gps' ? (isGpsLocked ? 'GPS Connected' : 'GPS Idle') : 'Simulator Active'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-slate-400 font-mono">Vehicle Speed</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {speedKmh}
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

            {/* Current Spatial H3 Hex ID */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Uber H3 Spatial Hex (Res 8)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">~0.74 km²</span>
              </div>
              <div className="mt-1.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-sm font-bold text-emerald-400 tracking-wider">#{currentCell.h3Index}</span>
                <span className="text-xs text-slate-500">O(1) Indexed</span>
              </div>
            </div>

            {/* Location & Townland */}
            <div className="mt-4">
              <p className="text-xs text-slate-400 font-mono">Active Townland</p>
              <h3 className="text-lg font-bold text-white mt-0.5">{currentCell.townland}</h3>
              <p className="text-xs font-mono text-emerald-400 mt-0.5">County {currentCell.county}</p>
            </div>

            {/* Live GPS Sensor Coordinates */}
            {drivingMode === "real-gps" && gpsState.coordinate && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{gpsState.coordinate.lat.toFixed(4)}°N, {Math.abs(gpsState.coordinate.lng).toFixed(4)}°W</span>
                </div>
                <span className="text-slate-400">±{gpsState.accuracyMeters}m</span>
              </div>
            )}

            {/* Total Distance Driven in Real GPS */}
            {drivingMode === 'real-gps' && isGpsLocked && (
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Trip Distance:</span>
                <span className="text-white font-bold">{(gpsState.totalDistanceDrivenMeters / 1000).toFixed(2)} km</span>
              </div>
            )}

          </div>

          {/* Simulator Milestones Scrubber (Visible in Simulator Mode) */}
          {drivingMode === 'simulator' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Demo Waypoints</span>
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
                        ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                        : idx < currentWaypointIndex
                        ? 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white'
                        : 'bg-slate-950/20 border-slate-800/40 text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${idx === currentWaypointIndex ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`}></span>
                      <span className="truncate max-w-[200px]">{wp.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 2 Columns: Ambient Audio Teaser & "PULL ON A THREAD" Interactive Deck */}
        <div className="lg:col-span-2 space-y-6">

          {/* 10-Second Ambient Audio Teaser (The Breadcrumb) */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Radio className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-emerald-300' : 'opacity-60'}`} />
                <span>Ambient Audio Teaser (Radio Éire)</span>
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
                <span>Replay Teaser</span>
              </button>
            </div>

            {/* Teaser Breadcrumb */}
            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-serif italic">
              "{currentCell.teaserScript}"
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tap any thread below or say "Tell Me More" to unfold the deep story:</span>
            </div>
          </div>

          {/* "PULL ON A THREAD" Interactive Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧵</span>
                <h3 className="text-sm font-mono text-slate-200 uppercase font-bold tracking-wider">
                  Pull On A Thread (Interactive Exploration)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">1-Tap Driver Safe</span>
            </div>

            {/* Large Interactive Thread Cards */}
            <div className="grid grid-cols-1 gap-3">
              {currentCell.threads && currentCell.threads.length > 0 ? (
                currentCell.threads.map((thread) => {
                  const isPulled = activeThread?.id === thread.id;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => onPullThread(thread)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-start justify-between gap-3 ${
                        isPulled
                          ? 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            thread.category === 'folklore'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : thread.category === 'monument'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {thread.category}
                          </span>
                          <span className="text-xs font-mono text-slate-500">1-Tap Listen</span>
                          {isPulled && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                              ✓ Saved to Scrapbook
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">{thread.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{thread.hookSnippet}</p>
                      </div>

                      <div className={`shrink-0 p-2.5 rounded-xl border transition-all ${
                        isPulled
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  No extra threads available for this cell.
                </div>
              )}
            </div>

            {/* Unfolded Deep Narrative Box if a thread has been pulled */}
            {activeThread && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-950 to-slate-950 border border-amber-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                      Unfolded Story: {activeThread.title}
                    </span>
                  </div>
                  <button
                    onClick={() => onPullThread(activeThread)}
                    className="flex items-center gap-1 text-xs text-amber-300 font-mono hover:text-white"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Story</span>
                  </button>
                </div>

                <blockquote className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif italic">
                  "{activeThread.spokenNarrative}"
                </blockquote>

                <p className="text-xs text-slate-400 font-mono pt-1">
                  {activeThread.detailMarkdown}
                </p>
              </div>
            )}

          </div>

          {/* 4 Cultural Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
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

            <div className="p-6">
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
                </div>
              )}

              {activeCardTab === 'monuments' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {currentCell.monuments.map((m) => (
                      <div key={m.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-bold font-mono">
                            {m.type} • {m.era}
                          </span>
                          <span className="text-xs font-mono text-emerald-400 font-semibold">
                            {m.distanceMeters}m from route
                          </span>
                        </div>
                        <h5 className="text-base font-bold text-white">{m.name}</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeCardTab === 'folklore' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">{currentCell.folklore.title}</h4>
                  <blockquote className="p-4 rounded-xl bg-slate-950 border-l-4 border-amber-500 text-sm text-slate-300 italic leading-relaxed">
                    "{currentCell.folklore.storySnippet}"
                  </blockquote>
                </div>
              )}

              {activeCardTab === 'geology' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">{currentCell.geology.name}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
                    {currentCell.geology.scientificInsight}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
