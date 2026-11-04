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
  Landmark,
  Waves,
  Users,
  FileText,
  Palette,
  Globe,
  BarChart3,
  Award,
  Volume2,
  ChevronRight,
  Bookmark,
  ArrowRight,
  Satellite,
  ShieldAlert,
  Sun,
  Activity,
  Mic,
  MicOff,
  Building2,
  Leaf,
  Shield,
  Pickaxe,
  Music,
  CloudRain,
  Trophy,
  Share2
} from 'lucide-react';
import { EnrichedH3Cell, SimulatedRoute, ThreadOption } from '../types';
import { RealGpsState } from '../services/realGpsService';
import { VoiceCommandState } from '../services/voiceCommandService';
import { audioService } from '../services/audioNarrationService';
import { ThreadImageFigure, imageForTrack } from './ThreadImageFigure';

interface DriveModeViewProps {
  // GPS & Driving Modes
  drivingMode: 'real-gps' | 'simulator';
  setDrivingMode: (mode: 'real-gps' | 'simulator') => void;
  gpsState: RealGpsState;
  onStartGps: () => void;
  onStopGps: () => void;

  // Voice & Audio Status
  voiceState: VoiceCommandState;
  serverVoiceAvailable: boolean;
  audioLastError: string | null;
  onOpenVoiceStudio: () => void;
  audioPlaybackState?: 'idle' | 'loading' | 'playing' | 'paused';
  currentTrackId?: string | null;
  onToggleVoiceListening?: () => void;
  selectedVoiceId?: string;
  onSelectVoice?: (voiceId: string) => void;
  onPullNextThread?: () => void;

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
  serverVoiceAvailable,
  audioLastError,
  onOpenVoiceStudio,
  audioPlaybackState = 'idle',
  currentTrackId = null,
  onToggleVoiceListening,
  selectedVoiceId = 'N2lVS1w4EtoT3dr4eOWO',
  onSelectVoice,
  onPullNextThread,
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
  const [activeCardTab, setActiveCardTab] = useState<
    | 'etymology'
    | 'monuments'
    | 'folklore'
    | 'geology'
    | 'history'
    | 'waterways'
    | 'council'
    | 'census'
    | 'art'
    | 'diaspora'
    | 'cso'
    | 'figures'
    | 'architecture'
    | 'ecology'
    | 'military'
    | 'excavation'
    | 'literature'
    | 'climate'
  >('etymology');
  const isGpsLocked = gpsState.status === 'locked';
  const isAcquiring = drivingMode === 'real-gps' && !isGpsLocked && (currentCell.h3Index === 'scanning...' || currentCell.townland === 'Acquiring GPS fix...');

  const handleShareText = async (title: string, text: string) => {
    const fullText = `${title}\n\n${text}\n\n— Shared via Where Am I? (Spatial Irish Audio Guide)`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: fullText });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(fullText);
      alert('Copied to clipboard!');
    }
  };

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
                {gpsState.isTracking
                  ? (isGpsLocked ? `${currentCell.townland} (${currentCell.county}) • Live Audio Tour Active` : '🛰️ Acquiring Satellite Signal...')
                  : (isGpsLocked ? `${currentCell.townland} (${currentCell.county}) • Ready to Drive` : 'Ready to drive in real life')}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {gpsState.isTracking ? (
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
            <span>Voice Command: "Tell Me More"</span>
          </div>
        )}

        {/* Hands-Free Voice Copilot Bar */}
        <button
          type="button"
          onClick={onToggleVoiceListening}
          aria-pressed={voiceState.isListening}
          title={voiceState.isListening ? 'Listening: tap to cancel' : 'Tap to talk'}
          className={`w-full text-left flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:px-5 min-h-[72px] rounded-2xl border text-xs font-mono cursor-pointer transition-all active:scale-[0.99] ${
            voiceState.isListening
              ? 'bg-emerald-950/40 border-emerald-500/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-xl flex items-center justify-center ${
                voiceState.isListening
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {voiceState.isListening ? (
                <Mic className="w-4 h-4 animate-pulse text-emerald-400" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </span>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-bold ${voiceState.isListening ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {voiceState.isListening ? '🎙️ Listening… say "Tell me more" or "Where am I"' : '🎙️ Tap to talk'}
                </span>
                {voiceState.isListening && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                {isSpeaking && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
                    🔇 Mic dormant during speech
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tap anywhere here, then say <strong className="text-cyan-300">"Where am I"</strong> • <strong className="text-emerald-300">"Tell me more"</strong> • <strong className="text-slate-300">"Stop audio"</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            {voiceState.lastHeardPhrase && (
              <span className="text-[10px] text-slate-300 italic bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 truncate max-w-[200px]">
                Heard: "{voiceState.lastHeardPhrase}"
              </span>
            )}
            <span
              className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold ${
                voiceState.isListening
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {voiceState.isListening ? 'Cancel' : 'Tap to talk'}
            </span>
          </div>
        </button>

        {/* Now showing: the photo for whatever is being spoken, large */}
        {(() => {
          const playing = audioPlaybackState === 'playing' || audioPlaybackState === 'paused';
          const shown = playing ? imageForTrack(currentTrackId, currentCell.threads, currentCell.teaserImage) : null;
          return shown ? (
            <div className="p-3 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wide text-amber-300">Now speaking: {shown.subject}</div>
              <ThreadImageFigure key={shown.image.url} image={shown.image} size="hero" subject={shown.subject} />
            </div>
          ) : null;
        })()}

        {/* ElevenLabs High-Fidelity Audio Indicator */}
        {audioLastError ? (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Audio notice: {audioLastError}.</span>
            </div>
            <button
              onClick={onOpenVoiceStudio}
              className="text-rose-400 hover:text-white text-xs underline font-bold"
            >
              Open Voice Studio
            </button>
          </div>
        ) : serverVoiceAvailable ? (
          <div className="px-3.5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold">🎙️ Voice: {audioService.getVoiceLabel()}</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400">Quick Try:</span>
              <button
                type="button"
                onClick={() => onSelectVoice?.('N2lVS1w4EtoT3dr4eOWO')}
                className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                  selectedVoiceId === 'N2lVS1w4EtoT3dr4eOWO'
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Callum: Rich, husky Celtic folklore storyteller (Universal Premade - Free & Paid)"
              >
                ☘️ Callum (Celtic)
              </button>
              <button
                type="button"
                onClick={() => onSelectVoice?.('JBFqnCBsd6RMkjVDRZzb')}
                className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                  selectedVoiceId === 'JBFqnCBsd6RMkjVDRZzb'
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="George: British / Celtic heritage narrator (Universal Premade - Free & Paid)"
              >
                🎙️ George (UK/Celtic)
              </button>
              <button
                type="button"
                onClick={() => onSelectVoice?.('2WvAXMgrakBkapSmnlv7')}
                className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                  selectedVoiceId === '2WvAXMgrakBkapSmnlv7'
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Flynn: Authentic Irish male narrator (Requires Paid ElevenLabs Tier)"
              >
                🇮🇪 Flynn (Paid Tier)
              </button>
              <button
                type="button"
                onClick={onOpenVoiceStudio}
                className="text-emerald-400 hover:text-white text-xs underline font-bold ml-1 cursor-pointer"
              >
                Studio...
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center justify-between font-mono">
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Voice: {audioService.getVoiceLabel()}</span>
            </div>
            <button
              onClick={onOpenVoiceStudio}
              className="text-amber-400 hover:text-white text-xs underline font-bold"
            >
              Change Voice / Add ElevenLabs
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
                <span className="text-sm font-bold text-emerald-400 tracking-wider">
                  {isAcquiring ? 'Scanning...' : `#${currentCell.h3Index}`}
                </span>
                <span className="text-xs text-slate-500">
                  {isAcquiring ? 'GPS Required' : 'O(1) Indexed'}
                </span>
              </div>
            </div>

            {/* Location & Townland */}
            <div className="mt-4">
              <p className="text-xs text-slate-400 font-mono">Active Townland</p>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {isAcquiring ? 'Locating Satellites...' : currentCell.townland}
              </h3>
              <p className="text-xs font-mono text-emerald-400 mt-0.5">
                {isAcquiring ? 'Acquiring GPS fix' : `County ${currentCell.county}`}
              </p>
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

              {!isAcquiring && (
                <button
                  onClick={onReplayAudio}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Replay Teaser</span>
                </button>
              )}
            </div>

            {!isAcquiring && currentCell.teaserImage && (
              <div className="mt-4">
                <ThreadImageFigure
                  key={currentCell.teaserImage.image.url}
                  image={currentCell.teaserImage.image}
                  subject={currentCell.teaserImage.subject}
                />
              </div>
            )}

            {/* Teaser Breadcrumb */}
            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-serif italic">
              {isAcquiring
                ? gpsState.status === 'requesting'
                  ? "🛰️ Connecting to GPS satellites... Standing by to stream local oral history and townland heritage for your actual physical location."
                  : "Ready for live vehicle drive mode. Tap 'Start Live GPS Driving' above to lock onto your location."
                : `"${currentCell.teaserScript}"`}
            </p>

            <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isAcquiring
                    ? "Once GPS locks, interactive heritage threads for your townland will unfold here automatically."
                    : 'Tap any thread below or say "Tell Me More" to explore:'}
                </span>
              </div>

              {!isAcquiring && currentCell.threads && currentCell.threads.length > 0 && onPullNextThread && (
                <button
                  onClick={onPullNextThread}
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  title="Move to the next story thread in this townland"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>🧵 Tell Me More (Next Topic)</span>
                </button>
              )}
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
              {isAcquiring ? (
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">
                      {gpsState.status === 'requesting' ? 'Locking Onto Irish GPS Satellites...' : 'Standing By For Live Driving'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                      {gpsState.status === 'requesting'
                        ? 'Acquiring GPS. Only verified information is shown; for most areas there is none yet.'
                        : 'Tap "Start Live GPS Driving" above to stream local oral history and townland heritage as you travel.'}
                    </p>
                  </div>
                </div>
              ) : currentCell.threads && currentCell.threads.length > 0 ? (
                currentCell.threads.map((thread) => {
                  const isPulled = activeThread?.id === thread.id;
                  const isThisTrack = currentTrackId === `thread-${thread.id}`;
                  const isThreadPlaying = isThisTrack && audioPlaybackState === 'playing';
                  const isThreadPaused = isThisTrack && audioPlaybackState === 'paused';
                  const isThreadLoading = isThisTrack && audioPlaybackState === 'loading';
                  return (
                    <div
                      key={thread.id}
                      onClick={() => onPullThread(thread)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${
                        isPulled
                          ? 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                      title={
                        isPulled
                          ? (isThreadPlaying ? 'Selected thread playing: tap to pause' : isThreadPaused ? 'Selected thread paused: tap to resume' : 'Selected thread')
                          : `Pull thread: ${thread.title}`
                      }
                    >
                      {thread.image && <ThreadImageFigure image={thread.image} size="thumb" />}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            thread.category === 'folklore'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : thread.category === 'monument'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : thread.category === 'art'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : thread.category === 'diaspora'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : thread.category === 'demographics'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : thread.category === 'architecture'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : thread.category === 'ecology'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : thread.category === 'military'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : thread.category === 'excavation'
                              ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30'
                              : thread.category === 'literature'
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : thread.category === 'climate'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {thread.category}
                          </span>
                          {isPulled ? (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                              isThreadPlaying
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : isThreadPaused
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : isThreadLoading
                                ? 'bg-slate-800 text-slate-300 border border-slate-700 animate-pulse'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {isThreadPlaying ? (
                                <>
                                  <Pause className="w-2.5 h-2.5 fill-current" />
                                  <span>Tap to pause</span>
                                </>
                              ) : isThreadPaused ? (
                                <>
                                  <Play className="w-2.5 h-2.5 fill-current" />
                                  <span>Paused (tap to play)</span>
                                </>
                              ) : isThreadLoading ? (
                                <span>Buffering...</span>
                              ) : (
                                <span>✓ Selected</span>
                              )}
                            </span>
                          ) : (
                            <span className="text-xs font-mono text-slate-500">1-Tap Listen</span>
                          )}
                          {isPulled && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                              ✓ Saved to Scrapbook
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">{thread.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{thread.hookSnippet}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareText(
                              `Where Am I? — ${thread.title} (${currentCell.townland})`,
                              `${thread.spokenNarrative}\n\n[Source: ${thread.detailMarkdown}]`
                            );
                          }}
                          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                          title="Share story snippet"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <div className={`p-2.5 rounded-xl border transition-all ${
                          isPulled
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                          {isPulled && isThreadPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : isPulled && isThreadPaused ? (
                            <Play className="w-4 h-4 fill-current" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
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
              <div
                onClick={() => onPullThread(activeThread)}
                className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-950 to-slate-950 border border-amber-500/40 hover:border-amber-500/70 space-y-3 animate-fadeIn cursor-pointer transition-all"
                title={
                  currentTrackId === `thread-${activeThread.id}` && audioPlaybackState === 'playing'
                    ? 'Tap box to pause story'
                    : 'Tap box to resume story'
                }
              >
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      currentTrackId === `thread-${activeThread.id}` && audioPlaybackState === 'playing'
                        ? 'bg-amber-400 animate-pulse'
                        : currentTrackId === `thread-${activeThread.id}` && audioPlaybackState === 'paused'
                        ? 'bg-amber-500'
                        : 'bg-slate-500'
                    }`}></span>
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                      Unfolded Story: {activeThread.title}
                    </span>
                    {currentTrackId === `thread-${activeThread.id}` && audioPlaybackState === 'playing' ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 flex items-center gap-1">
                        <Pause className="w-2.5 h-2.5 fill-current" />
                        Broadcasting (Tap box to pause)
                      </span>
                    ) : currentTrackId === `thread-${activeThread.id}` && audioPlaybackState === 'paused' ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Paused (Tap box to resume)
                      </span>
                    ) : currentTrackId === `thread-${activeThread.id}` && audioPlaybackState === 'loading' ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 animate-pulse">
                        Buffering...
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareText(
                          `${activeThread.title} (${currentCell.townland})`,
                          `${activeThread.spokenNarrative}\n\n[Source: ${activeThread.detailMarkdown}]`
                        );
                      }}
                      className="flex items-center gap-1 text-xs text-slate-400 font-mono hover:text-white"
                      title="Share story"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audioService.speak(activeThread.spokenNarrative, { trackId: `thread-${activeThread.id}` });
                      }}
                      className="flex items-center gap-1 text-xs text-amber-300 font-mono hover:text-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Replay Story</span>
                    </button>
                  </div>
                </div>

                {activeThread.image && <ThreadImageFigure key={activeThread.image.url} image={activeThread.image} />}

                <blockquote className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif italic">
                  "{activeThread.spokenNarrative}"
                </blockquote>

                <p className="text-xs text-slate-400 font-mono pt-1">
                  {activeThread.detailMarkdown}
                </p>
              </div>
            )}

          </div>

          {/* 6 Cultural Heritage Pillars + Civic Council Trails */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Civic & Historical Provenance Banner */}
            {currentCell.councilSource && !isAcquiring && (
              <div className="bg-gradient-to-r from-amber-500/15 via-slate-950 to-slate-900 border-b border-amber-500/25 px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-medium">
                  <span className="text-sm">🏛️</span>
                  <span className="font-bold">{currentCell.councilSource.trailName}</span>
                  <span className="text-slate-400 font-mono text-[11px] hidden md:inline">
                    • {currentCell.councilSource.councilName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{currentCell.councilSource.historicalSociety}</span>
                </div>
              </div>
            )}

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
                <span>Placename Etymology</span>
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
                <span>Folklore & Legends</span>
              </button>

              <button
                onClick={() => setActiveCardTab('history')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeCardTab === 'history'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>History & Rebellions</span>
              </button>

              <button
                onClick={() => setActiveCardTab('waterways')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeCardTab === 'waterways'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Waves className="w-4 h-4" />
                <span>Waterways & Spas</span>
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

              {currentCell.councilSource && (
                <button
                  onClick={() => setActiveCardTab('council')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'council'
                      ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Council & Tourist Trail</span>
                </button>
              )}

              {currentCell.census && (
                <button
                  onClick={() => setActiveCardTab('census')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'census'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>1911 Census & Land Records</span>
                </button>
              )}

              {currentCell.artReferences && currentCell.artReferences.length > 0 && (
                <button
                  onClick={() => setActiveCardTab('art')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'art'
                      ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Palette className="w-4 h-4 text-rose-400" />
                  <span>Art & NGI Gallery ({currentCell.artReferences.length})</span>
                </button>
              )}

              {currentCell.communityLinks && currentCell.communityLinks.length > 0 && (
                <button
                  onClick={() => setActiveCardTab('diaspora')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'diaspora'
                      ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>Diaspora & Global Ties ({currentCell.communityLinks.length})</span>
                </button>
              )}

              {currentCell.csoModern && (
                <button
                  onClick={() => setActiveCardTab('cso')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'cso'
                      ? 'border-sky-500 text-sky-400 bg-sky-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <span>CSO 2022 Live Pulse</span>
                </button>
              )}

              {currentCell.famousFigures && currentCell.famousFigures.length > 0 && (
                <button
                  onClick={() => setActiveCardTab('figures')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'figures'
                      ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Famous Figures ({currentCell.famousFigures.length})</span>
                </button>
              )}

              {currentCell.niahHeritage && currentCell.niahHeritage.length > 0 && (
                <button
                  onClick={() => setActiveCardTab('architecture')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'architecture'
                      ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>NIAH Architecture ({currentCell.niahHeritage.length})</span>
                </button>
              )}

              {currentCell.biodiversity && (
                <button
                  onClick={() => setActiveCardTab('ecology')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'ecology'
                      ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>Biodiversity & SACs</span>
                </button>
              )}

              {currentCell.militaryWitnesses && currentCell.militaryWitnesses.length > 0 && (
                <button
                  onClick={() => setActiveCardTab('military')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'military'
                      ? 'border-red-500 text-red-400 bg-red-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4 text-red-400" />
                  <span>Military Archives (1913–1921)</span>
                </button>
              )}

              {currentCell.motorwayArchaeology && currentCell.motorwayArchaeology.length > 0 && (
                <button
                  onClick={() => setActiveCardTab('excavation')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'excavation'
                      ? 'border-amber-600 text-amber-400 bg-amber-600/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Pickaxe className="w-4 h-4 text-amber-500" />
                  <span>Motorway Archaeology</span>
                </button>
              )}

              {currentCell.literaryAndMusic && (
                <button
                  onClick={() => setActiveCardTab('literature')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'literature'
                      ? 'border-teal-500 text-teal-400 bg-teal-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Music className="w-4 h-4 text-teal-400" />
                  <span>Literature & Trad Music</span>
                </button>
              )}

              {currentCell.climateAndSport && (
                <button
                  onClick={() => setActiveCardTab('climate')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeCardTab === 'climate'
                      ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                  <span>Historical Climate & Sport</span>
                </button>
              )}
            </div>

            <div className="p-6">
              {isAcquiring ? (
                <div className="text-center py-8 text-xs text-slate-500 font-mono space-y-2">
                  <div className="text-xl">🛰️</div>
                  <p className="text-slate-300 font-bold">Townland Etymology & Cultural Heritage Standby</p>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Waiting for a GPS fix. Only verified information is shown; for most areas there is none yet.
                  </p>
                </div>
              ) : (
                <>
                  {activeCardTab === 'etymology' && !currentCell.etymology && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      No verified information for this area yet.
                    </div>
                  )}
                  {activeCardTab === 'etymology' && currentCell.etymology && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xs font-mono text-emerald-400 uppercase">Gaeilge (Irish Gaelic)</span>
                          <h4 className="text-2xl font-black text-white">{currentCell.etymology.irishName}</h4>
                          {currentCell.etymology.phonetic && (
                            <p className="text-xs font-mono text-slate-400 mt-0.5">
                              Phonetic pronunciation: <span className="text-amber-400 font-bold">{currentCell.etymology.phonetic}</span>
                            </p>
                          )}
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

                  {activeCardTab === 'folklore' && !currentCell.folklore && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      No verified information for this area yet.
                    </div>
                  )}
                  {activeCardTab === 'folklore' && currentCell.folklore && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">{currentCell.folklore.title}</h4>
                      <blockquote className="p-4 rounded-xl bg-slate-950 border-l-4 border-amber-500 text-sm text-slate-300 italic leading-relaxed">
                        "{currentCell.folklore.storySnippet}"
                      </blockquote>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                        <span>Informant: {currentCell.folklore.informant}</span>
                        <span>{currentCell.folklore.duchasVolumeId}</span>
                      </div>
                    </div>
                  )}

                  {activeCardTab === 'history' && (
                    <div className="space-y-4">
                      {currentCell.history ? (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                            <div>
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-bold font-mono">
                                {currentCell.history.era}
                              </span>
                              <h4 className="text-xl font-bold text-white mt-1.5">{currentCell.history.title}</h4>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="text-xs font-mono text-slate-400">Historical Figure</span>
                              <p className="text-sm font-bold text-emerald-400">{currentCell.history.figure}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800 font-serif">
                            {currentCell.history.narrative}
                          </p>
                        </>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                          No verified information for this area yet.
                        </div>
                      )}
                    </div>
                  )}

                  {activeCardTab === 'waterways' && (
                    <div className="space-y-4">
                      {currentCell.waterways ? (
                        <>
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono">
                                {currentCell.waterways.type}
                              </span>
                              <h4 className="text-xl font-bold text-white mt-1.5">{currentCell.waterways.name}</h4>
                            </div>
                            <Waves className="w-6 h-6 text-cyan-400 opacity-60" />
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                            {currentCell.waterways.significance}
                          </p>
                        </>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                          No verified information for this area yet.
                        </div>
                      )}
                    </div>
                  )}

                  {activeCardTab === 'geology' && !currentCell.geology && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      No verified information for this area yet.
                    </div>
                  )}
                  {activeCardTab === 'geology' && currentCell.geology && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">{currentCell.geology.name}</h4>
                      <p className="text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
                        {currentCell.geology.scientificInsight}
                      </p>
                    </div>
                  )}

                  {activeCardTab === 'council' && currentCell.councilSource && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                            Local Authority & Historical Society Trail
                          </span>
                          <h4 className="text-xl font-bold text-white mt-1.5">{currentCell.councilSource.trailName}</h4>
                          <p className="text-xs font-mono text-emerald-400 mt-0.5">
                            Local Authority: {currentCell.councilSource.councilName}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-mono text-slate-400">Historical Society</span>
                          <p className="text-sm font-bold text-amber-400">{currentCell.councilSource.historicalSociety}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-xs font-mono text-slate-400 uppercase mb-2">Trail Waypoints & Civic Highlights</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {currentCell.councilSource.keyHighlights.map((hl, i) => (
                            <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                              <span className="text-amber-400 font-mono font-bold text-xs mt-0.5">0{i + 1}</span>
                              <p className="text-xs text-slate-200 leading-relaxed">{hl}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span>Archive & Research Citation:</span>
                        <span className="text-slate-300 font-semibold">{currentCell.councilSource.archiveCitation}</span>
                      </div>
                    </div>
                  )}

                  {activeCardTab === 'census' && currentCell.census && (
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold font-mono">
                            National Archives of Ireland & Valuation Office
                          </span>
                          <h4 className="text-xl font-bold text-white mt-1.5">
                            {currentCell.townland} Demographics & Land Heritage
                          </h4>
                          <p className="text-xs font-mono text-slate-400 mt-0.5">
                            Primary Sources: 1911 Census Return Form A/B1 & 1850s Griffith’s Valuation
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-mono text-slate-400">1911 Census Year</span>
                          <p className="text-sm font-bold text-indigo-400">Recorded April 2, 1911</p>
                        </div>
                      </div>

                      {/* 4 Key Census Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-xs text-slate-400 font-mono">1911 Population</span>
                          <p className="text-lg font-black text-white mt-0.5">{currentCell.census.totalPopulation.toLocaleString()}</p>
                          <span className="text-[10px] text-slate-500 font-mono">Documented residents</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-xs text-slate-400 font-mono">Houses & Roofs</span>
                          <p className="text-lg font-black text-white mt-0.5">{currentCell.census.inhabitedHouses} Houses</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {currentCell.census.roofTypes.slateOrTile} slate • {currentCell.census.roofTypes.thatchOrWood} thatch
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-xs text-slate-400 font-mono">Literacy Rate</span>
                          <p className="text-lg font-black text-emerald-400 mt-0.5">{currentCell.census.literacyRatePct}%</p>
                          <span className="text-[10px] text-slate-500 font-mono">Can read and write</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-xs text-slate-400 font-mono">Irish Language</span>
                          <p className="text-lg font-black text-amber-400 mt-0.5">{currentCell.census.irishSpeakersCount}</p>
                          <span className="text-[10px] text-slate-400 font-mono">Bilingual speakers</span>
                        </div>
                      </div>

                      {/* Great Famine Impact (1841 vs 1851) */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/30 via-slate-950 to-slate-950 border border-rose-500/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold uppercase text-rose-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            The Great Famine Depopulation (1841–1851)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-xs">
                            {currentCell.census.famineImpact.changePct} Decline
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pt-1">
                          {currentCell.census.famineImpact.narrative}
                        </p>
                        <div className="text-[11px] font-mono text-slate-400 pt-1 flex items-center justify-between border-t border-slate-800/80">
                          <span>1841 Population: <b className="text-white">{currentCell.census.famineImpact.pop1841.toLocaleString()}</b></span>
                          <span>1851 Population: <b className="text-rose-300">{currentCell.census.famineImpact.pop1851.toLocaleString()}</b></span>
                        </div>
                      </div>

                      {/* Top 1911 Occupations */}
                      <div>
                        <h5 className="text-xs font-mono text-slate-400 uppercase mb-2">1911 Trades & Living Occupations</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {currentCell.census.topOccupations.map((trade, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-200 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                              <span>{trade}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Griffith's Valuation (1852/1853) & Landlord */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-2">
                          <div>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                              <FileText className="w-3 h-3" />
                              <span>Griffith’s Primary Valuation of Tenements ({currentCell.census.griffithsValuation.yearRecorded})</span>
                            </span>
                            <h6 className="text-sm font-bold text-white mt-0.5">
                              Principal Landlord / Immediate Lessor: {currentCell.census.griffithsValuation.primaryLessor}
                            </h6>
                          </div>
                          <span className="text-xs font-mono text-slate-300">
                            Total Valuation: <b className="text-emerald-400">{currentCell.census.griffithsValuation.annualValuationPounds}</b>
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          <span className="text-slate-400 font-mono">Predominant Family Surnames: </span>
                          <span className="font-semibold text-slate-200">
                            {currentCell.census.griffithsValuation.predominantFamilyNames.join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* 1656 Down Survey (Trinity College Dublin) */}
                      {currentCell.census.downSurvey1656 && (
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                            <span>1656 Down Survey (Sir William Petty / TCD GIS)</span>
                            <span>Barony Parish Record</span>
                          </div>
                          <p className="text-slate-300 text-xs">
                            <b className="text-slate-400 font-mono">1641 Catholic Landowner: </b>
                            {currentCell.census.downSurvey1656.catholicLandowner1641} • <b className="text-slate-400 font-mono">1656 Grantee: </b>
                            {currentCell.census.downSurvey1656.cromwellianGrantee1656}
                          </p>
                          <p className="text-slate-400 text-[11px] font-mono">
                            {currentCell.census.downSurvey1656.terrainNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Art & National Gallery References */}
                  {activeCardTab === 'art' && currentCell.artReferences && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-rose-400" />
                            <span className="text-xs font-mono text-rose-400 uppercase font-bold">Art & National Gallery Collections</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">Visual Heritage of {currentCell.townland}</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 font-mono text-xs font-bold border border-rose-500/20">
                          National Gallery of Ireland (NGI) & NLI Archives
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {currentCell.artReferences.map((art) => (
                          <div key={art.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-800/80 pb-2">
                              <div>
                                <span className="text-xs font-mono text-rose-400 font-bold">{art.artist} {art.artistLifespan && `(${art.artistLifespan})`}</span>
                                <h5 className="text-base font-black text-white mt-0.5">{art.artworkTitle}</h5>
                              </div>
                              <div className="text-left sm:text-right">
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                  {art.yearCreated} • {art.medium}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-200 leading-relaxed">
                              {art.description}
                            </p>

                            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="font-serif italic"><b className="font-mono not-italic text-rose-400">Significance: </b>{art.culturalSignificance}</span>
                              <span className="text-[10px] font-mono shrink-0 px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                🏛️ {art.galleryOrCollection} {art.catalogRef && `• ${art.catalogRef}`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diaspora & International Ties (e.g. Parco Italia) */}
                  {activeCardTab === 'diaspora' && currentCell.communityLinks && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-mono text-purple-400 uppercase font-bold">Diaspora & International Connections</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">Global Ties & Cultural Footprints</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-mono text-xs font-bold border border-purple-500/20">
                          Diplomatic & European Heritage
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {currentCell.communityLinks.map((link) => (
                          <div key={link.id} className="p-5 rounded-xl bg-gradient-to-r from-purple-950/20 via-slate-950 to-slate-950 border border-purple-500/30 space-y-3">
                            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl">{link.flagEmoji}</span>
                                <div>
                                  <h5 className="text-base font-bold text-white">{link.communityName}</h5>
                                  <span className="text-xs font-mono text-purple-400">{link.connectionEra}</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-xs font-bold text-slate-200">
                              {link.summary}
                            </p>

                            <p className="text-xs text-slate-300 leading-relaxed font-serif">
                              {link.narrative}
                            </p>

                            <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Key Milestones & Diplomatic Figures:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {link.keyFiguresOrMilestones.map((milestone, idx) => (
                                  <span key={idx} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-purple-500/30 text-purple-200">
                                    • {milestone}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CSO Live 2022 Census & Modern Demographics */}
                  {activeCardTab === 'cso' && currentCell.csoModern && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-sky-400" />
                            <span className="text-xs font-mono text-sky-400 uppercase font-bold">CSO Census 2022</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">{currentCell.townland} Contemporary Profile</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 font-mono text-xs font-bold border border-sky-500/20">
                          Central Statistics Office (CSO) 2022
                        </span>
                      </div>

                      {/* 4 Modern Demographic Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-xs text-slate-400 font-mono">2022 Population</span>
                          <p className="text-lg font-black text-white mt-0.5">{currentCell.csoModern.population2022.toLocaleString()}</p>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">
                            {currentCell.csoModern.growthFrom1911Pct} since 1911
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-xs text-slate-400 font-mono">Private Households</span>
                          <p className="text-lg font-black text-white mt-0.5">{currentCell.csoModern.households2022.toLocaleString()}</p>
                          <span className="text-[10px] text-slate-500 font-mono">Occupied homes</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-xs text-slate-400 font-mono">Broadband Connectivity</span>
                          <p className="text-lg font-black text-sky-400 mt-0.5">{currentCell.csoModern.broadbandCoveragePct}%</p>
                          <span className="text-[10px] text-slate-500 font-mono">High-speed broadband</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-xs text-slate-400 font-mono">Historical Baseline</span>
                          <p className="text-lg font-black text-amber-400 mt-0.5">
                            {currentCell.census ? currentCell.census.totalPopulation.toLocaleString() : 'N/A'}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">1911 Census baseline</span>
                        </div>
                      </div>

                      {/* Demographic Narrative */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <span className="text-xs font-mono uppercase text-sky-400 font-bold">Community Profile:</span>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {currentCell.csoModern.demographicProfile}
                        </p>
                      </div>

                      {/* Economic Drivers & Infrastructure */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Primary Economic Drivers</span>
                          <div className="space-y-1.5">
                            {currentCell.csoModern.economicDrivers.map((driver, i) => (
                              <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                <span>{driver}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <span className="text-xs font-mono uppercase text-sky-400 font-bold">Infrastructure & Innovation</span>
                          <div className="space-y-1.5">
                            {currentCell.csoModern.infrastructureMilestones.map((infra, i) => (
                              <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
                                <span>{infra}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Famous Figures */}
                  {activeCardTab === 'figures' && currentCell.famousFigures && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-mono text-amber-400 uppercase font-bold">Famous Local Figures</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">Legends, Innovators & Pioneers of {currentCell.townland}</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono text-xs font-bold border border-amber-500/20">
                          Dictionary of Irish Biography
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentCell.famousFigures.map((fig, i) => (
                          <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                {fig.category}
                              </span>
                              <span className="text-xs font-mono text-slate-400">{fig.lifespan}</span>
                            </div>

                            <h5 className="text-base font-bold text-white">{fig.name}</h5>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              {fig.significance}
                            </p>

                            <div className="pt-2 border-t border-slate-800/80">
                              <p className="text-[11px] text-amber-200/90 font-serif italic">
                                "{fig.quoteOrLegacy}"
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Architecture (NIAH Built Heritage) */}
                  {activeCardTab === 'architecture' && currentCell.niahHeritage && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-mono text-blue-400 uppercase font-bold">
                              National Inventory of Architectural Heritage (NIAH)
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">
                            Georgian, Regency & Victorian Built Heritage
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleShareText(
                                `NIAH Architecture of ${currentCell.townland}`,
                                currentCell.niahHeritage!
                                  .map(
                                    (h) =>
                                      `🏛️ ${h.buildingName} (${h.datePeriod}) - ${h.category} [NIAH Reg: ${h.regNumber}, Rating: ${h.rating}]\n${h.description}`
                                  )
                                  .join('\n\n')
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-blue-300 text-xs font-mono transition-all"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share Built Heritage</span>
                          </button>
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 font-mono text-xs font-bold border border-blue-500/20">
                            Department of Heritage
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {currentCell.niahHeritage.map((item) => (
                          <div
                            key={item.regNumber}
                            className="p-5 rounded-xl bg-gradient-to-r from-blue-950/20 via-slate-950 to-slate-950 border border-blue-500/30 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-500/20 pb-2">
                              <div>
                                <h5 className="text-base font-bold text-white">{item.buildingName}</h5>
                                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mt-0.5">
                                  <span>{item.category}</span>
                                  <span>•</span>
                                  <span>{item.datePeriod}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                  item.rating === 'National'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                  {item.rating} Rating
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                                  Reg: {item.regNumber}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-serif">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Biodiversity & SACs (NBDC & NPWS) */}
                  {activeCardTab === 'ecology' && currentCell.biodiversity && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-mono text-emerald-400 uppercase font-bold">
                              National Biodiversity Data Centre (NBDC) & NPWS
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">
                            {currentCell.biodiversity.sacOrSpa}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleShareText(
                                `Biodiversity of ${currentCell.townland}: ${currentCell.biodiversity!.sacOrSpa}`,
                                currentCell.biodiversity!.indicatorSpecies
                                  .map(
                                    (s) =>
                                      `🌿 ${s.commonName} (${s.irishName} / ${s.scientificName}) [${s.status}]: ${s.notes}`
                                  )
                                  .join('\n\n')
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share Flora & Fauna</span>
                          </button>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/20">
                            {currentCell.biodiversity.designationType}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200">
                        <b className="font-mono text-emerald-400 uppercase">Conservation Note: </b>
                        {currentCell.biodiversity.conservationNotes}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentCell.biodiversity.indicatorSpecies.map((sp, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="text-sm font-bold text-white">{sp.commonName}</h5>
                                <p className="text-xs text-emerald-400 font-mono">
                                  {sp.irishName} • <span className="italic text-slate-400">{sp.scientificName}</span>
                                </p>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold shrink-0">
                                {sp.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-serif">
                              {sp.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Military Archives (1913–1921 BMH) */}
                  {activeCardTab === 'military' && currentCell.militaryWitnesses && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-red-400" />
                            <span className="text-xs font-mono text-red-400 uppercase font-bold">
                              Bureau of Military History 1913–1921 (Military Archives)
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">
                            Sworn Eyewitness Statements & Revolutionary Operations
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleShareText(
                                `Military Archives of ${currentCell.townland}`,
                                currentCell.militaryWitnesses!
                                  .map(
                                    (m) =>
                                      `🎖️ ${m.witnessName} (${m.unitOrBrigade}) [${m.bureauRef}]:\n"${m.eyewitnessExcerpt}"\nContext: ${m.historicalContext}`
                                  )
                                  .join('\n\n')
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/30 text-red-300 text-xs font-mono transition-all"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share Statement</span>
                          </button>
                          <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 font-mono text-xs font-bold border border-red-500/20">
                            Declassified Sworn Records
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {currentCell.militaryWitnesses.map((w, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-xl bg-gradient-to-r from-red-950/20 via-slate-950 to-slate-950 border border-red-500/30 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/20 pb-2">
                              <div>
                                <h5 className="text-base font-bold text-white">{w.witnessName}</h5>
                                <p className="text-xs font-mono text-red-400 mt-0.5">
                                  {w.unitOrBrigade} • {w.period}
                                </p>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-red-500/30 text-red-300 font-bold">
                                {w.bureauRef}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-slate-200">
                              {w.summary}
                            </p>

                            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                              <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
                                "{w.eyewitnessExcerpt}"
                              </p>
                            </div>

                            <div className="text-[11px] text-slate-400 font-mono">
                              <b className="text-red-400">Strategic Context: </b>
                              {w.historicalContext}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Motorway Archaeology (TII & NMI) */}
                  {activeCardTab === 'excavation' && currentCell.motorwayArchaeology && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Pickaxe className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                              Transport Infrastructure Ireland (TII) Archaeological Monograph
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">
                            Rescue Excavations & Prehistoric Roadway Discoveries
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleShareText(
                                `Motorway Archaeology of ${currentCell.townland}`,
                                currentCell.motorwayArchaeology!
                                  .map(
                                    (exc) =>
                                      `⛏️ ${exc.siteName} (${exc.period}) [Lic: ${exc.excavationLicense}]:\n${exc.discovery}\nMuseum Artifacts:\n${(exc.museumArtifacts || []).map((a) => `• ${a}`).join('\n')}`
                                  )
                                  .join('\n\n')
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-mono transition-all"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share Excavations</span>
                          </button>
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono text-xs font-bold border border-amber-500/20">
                            National Museum of Ireland
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {currentCell.motorwayArchaeology.map((exc, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-xl bg-gradient-to-r from-amber-950/20 via-slate-950 to-slate-950 border border-amber-600/30 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-600/20 pb-2">
                              <div>
                                <h5 className="text-base font-bold text-white">{exc.siteName}</h5>
                                <p className="text-xs font-mono text-amber-400 mt-0.5">
                                  {exc.roadScheme} • <span className="text-slate-300 font-bold">{exc.period}</span>
                                </p>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-amber-600/30 text-amber-300">
                                License: {exc.excavationLicense}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed font-serif">
                              {exc.discovery}
                            </p>

                            {exc.museumArtifacts && exc.museumArtifacts.length > 0 && (
                              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                                  National Museum Cataloged Artifacts:
                                </span>
                                <div className="space-y-1">
                                  {exc.museumArtifacts.map((art, aIdx) => (
                                    <div key={aIdx} className="text-xs text-amber-200 flex items-center gap-1.5 font-mono">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                                      <span>{art}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Literature & Traditional Music (Joyce, Swift, ITMA) */}
                  {activeCardTab === 'literature' && currentCell.literaryAndMusic && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4 text-teal-400" />
                            <span className="text-xs font-mono text-teal-400 uppercase font-bold">
                              Literary Geography & Irish Traditional Music Archive (ITMA)
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">
                            Verse, Nocturnes & Traditional Fiddle Airs
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleShareText(
                                `Literature & Traditional Music of ${currentCell.townland}`,
                                `📚 Literary Works:\n` +
                                  currentCell.literaryAndMusic!.literaryReferences
                                    .map((lit) => `• ${lit.author} - "${lit.workTitle}" (${lit.yearPublished || 'Historical'}): "${lit.excerptOrTheme}"`)
                                    .join('\n') +
                                  (currentCell.literaryAndMusic!.traditionalMusic
                                    ? `\n\n🎻 Traditional Tunes:\n` +
                                      currentCell.literaryAndMusic!.traditionalMusic
                                        .map((t) => `• ${t.tuneTitle} (${t.irishTitle || ''}) [${t.tuneType}]: ${t.notes}`)
                                        .join('\n')
                                    : '')
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-teal-500/30 text-teal-300 text-xs font-mono transition-all"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share Lore & Music</span>
                          </button>
                          <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 font-mono text-xs font-bold border border-teal-500/20">
                            Leinster Cultural Canon
                          </span>
                        </div>
                      </div>

                      {/* Literary References */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-mono uppercase text-teal-400 font-bold">Literary References:</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentCell.literaryAndMusic.literaryReferences.map((lit, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">{lit.author}</span>
                                <span className="text-xs font-mono text-slate-400">{lit.yearPublished}</span>
                              </div>
                              <p className="text-xs text-teal-300 font-mono italic">"{lit.workTitle}"</p>
                              <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-xs text-slate-300 font-serif italic">
                                "{lit.excerptOrTheme}"
                              </div>
                              <p className="text-[11px] text-slate-400 font-sans">
                                <b className="text-slate-300 font-mono">Local Anchor: </b>{lit.geographicalTie}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Traditional Music */}
                      {currentCell.literaryAndMusic.traditionalMusic && currentCell.literaryAndMusic.traditionalMusic.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="text-xs font-mono uppercase text-teal-400 font-bold">Traditional Repertoire & Collectors:</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentCell.literaryAndMusic.traditionalMusic.map((tune, idx) => (
                              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h6 className="text-sm font-bold text-white">{tune.tuneTitle}</h6>
                                    <span className="text-xs text-teal-400 font-mono">{tune.irishTitle}</span>
                                  </div>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                                    {tune.tuneType}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-serif">
                                  {tune.notes}
                                </p>
                                <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                                  Collector: {tune.collectorOrComposer}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Climate Extremes & Sporting Heritage (Met Éireann & GAA) */}
                  {activeCardTab === 'climate' && currentCell.climateAndSport && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <CloudRain className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                              Met Éireann Archives & Kildare Sporting Lore
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-white mt-1">
                            Historical Climate Extremes & Sporting Heritage
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleShareText(
                                `Climate & Sporting Heritage of ${currentCell.townland}`,
                                `${currentCell.climateAndSport!.climateEvent ? `❄️ ${currentCell.climateAndSport!.climateEvent.name} (${currentCell.climateAndSport!.climateEvent.year}):\n${currentCell.climateAndSport!.climateEvent.phenomenon}\nImpact: ${currentCell.climateAndSport!.climateEvent.impactOnSettlement}\n\n` : ''}🏆 Sporting Heritage:\n• GAA: ${currentCell.climateAndSport!.equineAndGaa?.gaaTradition || 'Local tradition'}\n• Equine/Aquatics: ${currentCell.climateAndSport!.equineAndGaa?.thoroughbredTradition || 'Local tradition'}`
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-all"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share Climate & Sport</span>
                          </button>
                          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/20">
                            Met Éireann & GAA Archives
                          </span>
                        </div>
                      </div>

                      {/* Climate Event Card */}
                      {currentCell.climateAndSport.climateEvent && (
                        <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/20 via-slate-950 to-slate-950 border border-cyan-500/30 space-y-3">
                          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">❄️</span>
                              <div>
                                <h5 className="text-base font-bold text-white">{currentCell.climateAndSport.climateEvent.name}</h5>
                                <span className="text-xs font-mono text-cyan-400">{currentCell.climateAndSport.climateEvent.year}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 font-bold">
                              Historical Climate Record
                            </span>
                          </div>

                          <p className="text-xs font-bold text-slate-200">
                            {currentCell.climateAndSport.climateEvent.phenomenon}
                          </p>

                          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-serif">
                            <b className="font-mono text-cyan-400 uppercase not-italic">Impact on Settlement: </b>
                            {currentCell.climateAndSport.climateEvent.impactOnSettlement}
                          </div>
                        </div>
                      )}

                      {/* Sporting & Equine Heritage Card */}
                      {currentCell.climateAndSport.equineAndGaa && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-amber-400" />
                              <h6 className="text-sm font-bold text-white">GAA Sporting Tradition</h6>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-serif">
                              {currentCell.climateAndSport.equineAndGaa.gaaTradition}
                            </p>
                          </div>

                          {currentCell.climateAndSport.equineAndGaa.thoroughbredTradition && (
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                              <div className="flex items-center gap-2">
                                <Compass className="w-4 h-4 text-emerald-400" />
                                <h6 className="text-sm font-bold text-white">Equine & Water Sports</h6>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-serif">
                                {currentCell.climateAndSport.equineAndGaa.thoroughbredTradition}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
