import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { DriveModeView } from './components/DriveModeView';
import { MapExplorerView } from './components/MapExplorerView';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { TripScrapbookModal } from './components/TripScrapbookModal';
import { TripLogPanel, TripLogEntry } from './components/TripLogPanel';
import { SIMULATED_ROUTES } from './data/irelandRoutes';
import { resolveCell, cellFromWaypoint } from './services/cellResolver';
import { TeaserGate, DEFAULT_QUIET_GAP_MS } from './services/teaserPolicy';
import { coordinateToH3, calculateBearing } from './services/spatialEngine';
import { audioService } from './services/audioNarrationService';
import { realGpsService, RealGpsState } from './services/realGpsService';
import { voiceCommandService, VoiceCommandState } from './services/voiceCommandService';
import { EnrichedH3Cell, ThreadOption, SavedTripThread } from './types';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drive' | 'map'>('drive');
  
  // Standby acquiring state before GPS satellite lock (Never show Galway by default)
  const INITIAL_ACQUIRING_CELL: EnrichedH3Cell = {
    h3Index: 'scanning...',
    center: { lat: 53.4, lng: -7.9 },
    townland: 'Acquiring GPS fix...',
    parish: '',
    county: '',
    monuments: [],
    teaserScript: 'Connecting to GPS.',
    narrativeScript: 'Connecting to GPS.',
    threads: [],
    keyHighlights: [],
    sources: [],
    curatedByAgent: false,
    enrichmentLatencyMs: 0,
    tokensConsumed: 0
  };

  // DRIVING MODE: Primary is 'real-gps' (real vehicle hardware GPS), 'simulator' is demo bolt-on
  const [drivingMode, setDrivingMode] = useState<'real-gps' | 'simulator'>('real-gps');
  const [gpsState, setGpsState] = useState<RealGpsState>(realGpsService.getState());

  // Simulator route state
  const [currentRoute, setCurrentRoute] = useState(SIMULATED_ROUTES[0]);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Audio & Modals
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioPlaybackState, setAudioPlaybackState] = useState<'idle' | 'loading' | 'playing' | 'paused'>(audioService.getPlaybackState());
  const [currentAudioTrackId, setCurrentAudioTrackId] = useState<string | null>(audioService.getCurrentTrackId());
  const [voiceState, setVoiceState] = useState<VoiceCommandState>(voiceCommandService.getState());
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isScrapbookOpen, setIsScrapbookOpen] = useState(false);
  const [, setVoiceVersion] = useState(0);

  // Active cell & threads: Initialize with neutral acquiring state (Never Galway)
  const [currentCell, setCurrentCell] = useState<EnrichedH3Cell>(INITIAL_ACQUIRING_CELL);
  const [activeThread, setActiveThread] = useState<ThreadOption | null>(null);

  // Trip Scrapbook persistence
  const [savedThreads, setSavedThreads] = useState<SavedTripThread[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('whereami_saved_threads');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  // Subscribe to audio & playback state
  useEffect(() => {
    const unsub = audioService.subscribe((speaking) => {
      setIsSpeaking(speaking);
      voiceCommandService.setAudioSpeaking(speaking);
    });
    const unsubState = audioService.subscribePlaybackState((state, trackId) => {
      setAudioPlaybackState(state);
      setCurrentAudioTrackId(trackId);
    });
    return () => {
      unsub();
      unsubState();
    };
  }, []);

  // Teaser gate: once per area per trip, never over "Tell me more", minimum quiet gap (see teaserPolicy.ts)
  const teaserGateRef = useRef(new TeaserGate(DEFAULT_QUIET_GAP_MS));

  // Trip log for drive tests: one line per area entered (plus every spoken teaser)
  const [tripLog, setTripLog] = useState<TripLogEntry[]>([]);
  const lastLoggedAreaRef = useRef<string>('');
  const logTrip = (cell: EnrichedH3Cell, outcome: string) => {
    const key = cell.areaId ?? cell.h3Index;
    if (key === lastLoggedAreaRef.current && !outcome.startsWith('spoken')) return;
    lastLoggedAreaRef.current = key;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTripLog((prev) => [...prev.slice(-199), { time, area: cell.townland, kind: cell.areaKind ?? '?', outcome }]);
  };

  /**
   * Plays the area teaser if the agreed policy allows it. `userRequested` = explicit tap (e.g. Replay).
   * Automatic triggers never queue: if blocked, nothing plays now.
   */
  const playCellTeaser = (cell: EnrichedH3Cell, userRequested: boolean = false) => {
    if (isAudioMuted || !cell.teaserScript) return;
    if (cell.h3Index === 'scanning...') return;
    const now = Date.now();
    const decision = teaserGateRef.current.decide(
      { areaId: cell.areaId, kind: cell.areaKind, inBuiltUpArea: cell.inBuiltUpArea },
      audioService.isLongFormActive(), now, userRequested
    );
    logTrip(cell, decision.play ? (userRequested ? 'spoken (tap)' : 'spoken') : `silent: ${decision.reason}`);
    if (!decision.play) return;
    teaserGateRef.current.markPlayed(cell.areaId as string, now);
    audioService.speak(cell.teaserScript, { trackId: `ambient-teaser-${cell.areaId}` });
  };

  // Handle switching between Real GPS and Simulator
  const handleSetDrivingMode = (mode: 'real-gps' | 'simulator') => {
    setDrivingMode(mode);
    audioService.stop();
    teaserGateRef.current.reset();
    teaserGateRef.current.quietGapMs = mode === 'simulator' ? 0 : DEFAULT_QUIET_GAP_MS;
    if (mode === 'simulator') {
      const initWp = currentRoute.waypoints[currentWaypointIndex];
      const initH3 = coordinateToH3(initWp.coordinate, 8);
      setCurrentCell(cellFromWaypoint(initWp.name, initH3, initWp.coordinate));
    } else {
      if (gpsState.coordinate && gpsState.h3Index) {
        // Keep locked cell
      } else {
        setCurrentCell(INITIAL_ACQUIRING_CELL);
      }
    }
  };

  const handleToggleVoiceListening = () => {
    voiceCommandService.toggleListening();
  };

  // Subscribe to Real GPS state
  useEffect(() => {
    const unsubGps = realGpsService.subscribe(async (state) => {
      setGpsState(state);
      // Auto-start ambient audio teaser the moment satellite signal is ACQUIRED
      if (
        state.status === 'locked' &&
        state.coordinate &&
        state.h3Index
      ) {
        const cell = await resolveCell(state.h3Index, state.coordinate);
        setCurrentCell(cell);
        if (state.isTracking) {
          playCellTeaser(cell);
        }
      }
    });

    const unsubCell = realGpsService.onCellEntry(async (newH3Id, coord) => {
      const cell = await resolveCell(newH3Id, coord);
      setCurrentCell(cell);
      setActiveThread(null);
      const state = realGpsService.getState();
      if (state.isTracking) {
        playCellTeaser(cell);
      }
    });

    // Passive immediate GPS check on load if already permitted (populates visual townland, audio waits for user drive start)
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const h3 = coordinateToH3(coord, 8);
          realGpsService.updateLocationManually(coord, Math.round(pos.coords.accuracy) || 15);
          const cell = await resolveCell(h3, coord);
          setCurrentCell(cell);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    }

    return () => {
      unsubGps();
      unsubCell();
    };
  }, [isAudioMuted]);

  // Handle Real GPS Start/Stop
  const handleStartGps = async () => {
    audioService.unlockMobileAudio();
    await realGpsService.startTracking();

    // If satellite signal is ALREADY acquired / locked when user starts, auto-start teaser immediately!
    const state = realGpsService.getState();
    if (state.coordinate && state.h3Index) {
      const cell = await resolveCell(state.h3Index, state.coordinate);
      setCurrentCell(cell);
      playCellTeaser(cell);
    } else if (currentCell && currentCell.teaserScript && currentCell.h3Index !== 'scanning...') {
      playCellTeaser(currentCell);
    }
  };

  const handleStopGps = () => {
    voiceCommandService.stopListening();
    realGpsService.stopTracking();
    audioService.stop();
    teaserGateRef.current.reset();
  };

  // Simulator: derived waypoints & bearing
  const simWaypoint = currentRoute.waypoints[currentWaypointIndex];
  const nextSimWaypoint = currentRoute.waypoints[(currentWaypointIndex + 1) % currentRoute.waypoints.length];
  const simBearing = calculateBearing(simWaypoint.coordinate, nextSimWaypoint.coordinate);

  // Simulator waypoint update
  useEffect(() => {
    if (drivingMode === 'simulator') {
      const h3Idx = coordinateToH3(simWaypoint.coordinate, 8);
      const cell = cellFromWaypoint(simWaypoint.name, h3Idx, simWaypoint.coordinate);
      setCurrentCell(cell);
      setActiveThread(null);
      if (isPlaying) {
        playCellTeaser(cell);
      }
    }
  }, [currentWaypointIndex, currentRoute.id, drivingMode]);

  // Simulator timer loop
  useEffect(() => {
    if (drivingMode !== 'simulator' || !isPlaying) return;

    const intervalTime = 8000 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentWaypointIndex((prev) => {
        if (prev + 1 >= currentRoute.waypoints.length) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [drivingMode, isPlaying, playbackSpeed, currentRoute.waypoints.length]);

  const handleSimulatorRouteChange = (routeId: string) => {
    const found = SIMULATED_ROUTES.find((r) => r.id === routeId);
    if (found) {
      audioService.stop();
      setCurrentRoute(found);
      setCurrentWaypointIndex(0);
      setActiveThread(null);
      setIsPlaying(false);
    }
  };

  const handleToggleSimulatorPlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      audioService.unlockMobileAudio();
      playCellTeaser(currentCell);
    } else {
      audioService.stop();
      voiceCommandService.stopListening();
    }
  };

  const handleResetSimulator = () => {
    audioService.stop();
    setCurrentWaypointIndex(0);
    setActiveThread(null);
    setIsPlaying(false);
  };

  const handleToggleMute = () => {
    const muted = audioService.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleReplayAudio = () => {
    playCellTeaser(currentCell, true);
  };

  const handleSelectWaypoint = (index: number) => {
    audioService.stop();
    setCurrentWaypointIndex(index);
    setActiveThread(null);
    const wp = currentRoute.waypoints[index];
    const h3Idx = coordinateToH3(wp.coordinate, 8);
    const cell = cellFromWaypoint(wp.name, h3Idx, wp.coordinate);
    setCurrentCell(cell);
    playCellTeaser(cell, true);
  };

  const saveThreadToScrapbook = (thread: ThreadOption) => {
    setSavedThreads((prev) => {
      if (prev.some((t) => t.id === thread.id)) return prev;
      const newEntry: SavedTripThread = {
        id: thread.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        h3Index: currentCell.h3Index,
        townland: currentCell.townland,
        threadTitle: thread.title,
        category: thread.category,
        spokenNarrative: thread.spokenNarrative
      };
      const updated = [newEntry, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('whereami_saved_threads', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handlePullThread = (thread: ThreadOption) => {
    setActiveThread(thread);
    audioService.toggleTrack(`thread-${thread.id}`, thread.spokenNarrative);
    saveThreadToScrapbook(thread);
  };

  /**
   * Progressive Thread Unfolder:
   * When user triggers "Tell me more" or clicks Next Topic:
   * Advances cleanly to the NEXT topic in the active cell, never repeating the first response!
   */
  const handlePullNextThread = () => {
    if (!currentCell.threads || currentCell.threads.length === 0) {
      if (currentCell.narrativeScript) {
        audioService.speak(currentCell.narrativeScript, { trackId: `cell-narrative-${currentCell.h3Index}` });
      }
      return;
    }

    // Determine currently active or last played thread index
    const currentIndex = activeThread
      ? currentCell.threads.findIndex((t) => t.id === activeThread.id)
      : -1;

    const nextIndex = currentIndex + 1;

    if (nextIndex < currentCell.threads.length) {
      const nextThread = currentCell.threads[nextIndex];
      setActiveThread(nextThread);
      audioService.speak(nextThread.spokenNarrative, { trackId: `thread-${nextThread.id}` });
      saveThreadToScrapbook(nextThread);
    } else {
      // All curated threads have been explored: reveal the comprehensive oral folklore & townland history
      audioService.speak(
        `You have explored the main threads for ${currentCell.townland}. Here is the deeper historical heritage: ${currentCell.narrativeScript}`,
        { trackId: `cell-narrative-${currentCell.h3Index}` }
      );
      // Reset so the next trigger can cycle
      setActiveThread(null);
    }
  };

  const handleSelectVoice = (voiceId: string) => {
    audioService.setVoiceId(voiceId);
    setVoiceVersion((v) => v + 1);
  };

  const handleClearScrapbook = () => {
    setSavedThreads([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('whereami_saved_threads');
    }
  };

  // Subscribe to Voice Command triggers
  useEffect(() => {
    const unsubVoice = voiceCommandService.subscribe((state) => {
      setVoiceState(state);
    });

    const unsubCmd = voiceCommandService.onCommand((cmd) => {
      if (cmd === 'wake_word') {
        audioService.speak("Dia dhuit! Ask 'Where am I', or say 'Tell me more'.");
      } else if (cmd === 'where_am_i') {
        const text = currentCell.teaserScript;
        audioService.speak(text);
      } else if (cmd === 'tell_me_more') {
        handlePullNextThread();
      } else if (cmd === 'stop_audio') {
        audioService.stop();
      }
    });

    return () => {
      unsubVoice();
      unsubCmd();
    };
  }, [currentCell, activeThread]);

  // Telemetry values depending on active mode
  const activeSpeed = drivingMode === 'real-gps' ? gpsState.speedKmh : isPlaying ? Math.round(simWaypoint.speedLimitKmh * 0.95) : 0;
  const activeBearing = drivingMode === 'real-gps' ? gpsState.heading : simBearing;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAudioMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        isSpeaking={isSpeaking}
        currentRouteTitle={
          drivingMode === 'real-gps'
            ? gpsState.status === 'locked'
              ? `🛰️ Live GPS: ${currentCell.townland} (${currentCell.county})`
              : '🛰️ Live Vehicle GPS Mode'
            : `🕹️ Demo: ${currentRoute.title}`
        }
        onOpenVoiceStudio={() => setIsVoiceModalOpen(true)}
      />

      {/* Main View */}
      <main className="flex-1 pb-16">
        {activeTab === 'drive' && (
          <DriveModeView
            drivingMode={drivingMode}
            setDrivingMode={handleSetDrivingMode}
            gpsState={gpsState}
            onStartGps={handleStartGps}
            onStopGps={handleStopGps}
            voiceState={voiceState}
            serverVoiceAvailable={audioService.isServerVoiceAvailable()}
            audioLastError={audioService.getLastError()}
            onOpenVoiceStudio={() => setIsVoiceModalOpen(true)}
            selectedVoiceId={audioService.getVoiceId()}
            onSelectVoice={handleSelectVoice}
            audioPlaybackState={audioPlaybackState}
            currentTrackId={currentAudioTrackId}
            onToggleVoiceListening={handleToggleVoiceListening}
            onPullNextThread={handlePullNextThread}
            currentRoute={currentRoute}
            onRouteChange={handleSimulatorRouteChange}
            availableRoutes={SIMULATED_ROUTES}
            currentWaypointIndex={currentWaypointIndex}
            totalWaypoints={currentRoute.waypoints.length}
            isPlaying={isPlaying}
            onTogglePlay={handleToggleSimulatorPlay}
            onReset={handleResetSimulator}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            onSelectWaypoint={handleSelectWaypoint}
            currentCell={currentCell}
            isSpeaking={isSpeaking}
            onReplayAudio={handleReplayAudio}
            bearing={activeBearing}
            speedKmh={activeSpeed}
            onPullThread={handlePullThread}
            activeThread={activeThread}
            onOpenScrapbook={() => setIsScrapbookOpen(true)}
            savedThreadsCount={savedThreads.length}
          />
        )}
        {activeTab === 'drive' && <TripLogPanel entries={tripLog} onClear={() => setTripLog([])} />}

        {activeTab === 'map' && (
          <MapExplorerView
            currentRoute={currentRoute}
            currentWaypointIndex={currentWaypointIndex}
            currentCell={currentCell}
            onSelectWaypoint={handleSelectWaypoint}
          />
        )}


      </main>

      {/* Voice Settings Studio Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSettingsSaved={() => setVoiceVersion((v) => v + 1)}
      />

      {/* Trip Scrapbook Modal */}
      <TripScrapbookModal
        isOpen={isScrapbookOpen}
        onClose={() => setIsScrapbookOpen(false)}
        savedThreads={savedThreads}
        onClearScrapbook={handleClearScrapbook}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Where Am I? (Anseo) • Live Geospatial Vehicle Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500">Placenames: Logainm © Government of Ireland (CC BY 4.0) • Monuments: National Monuments Service, and buildings: NIAH, © Government of Ireland (CC BY 4.0) • Boundaries © Tailte Éireann (CC BY 4.0) • Map data © OpenStreetMap contributors</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <span>Autonomous Heritage Copilot</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
