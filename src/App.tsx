import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DriveModeView } from './components/DriveModeView';
import { MapExplorerView } from './components/MapExplorerView';
import { DevShowcaseView } from './components/DevShowcaseView';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { TripScrapbookModal } from './components/TripScrapbookModal';
import { SIMULATED_ROUTES } from './data/irelandRoutes';
import { getEnrichedDataForWaypoint } from './data/heritageKnowledgeBase';
import { coordinateToH3, calculateBearing } from './services/spatialEngine';
import { audioService } from './services/audioNarrationService';
import { realGpsService, RealGpsState } from './services/realGpsService';
import { voiceCommandService, VoiceCommandState } from './services/voiceCommandService';
import { DynamicHeritageService } from './services/dynamicHeritageService';
import { EnrichedH3Cell, ThreadOption, SavedTripThread } from './types';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drive' | 'map' | 'dev'>('drive');
  
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
  const [voiceState, setVoiceState] = useState<VoiceCommandState>(voiceCommandService.getState());
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isScrapbookOpen, setIsScrapbookOpen] = useState(false);
  const [, setVoiceVersion] = useState(0);

  // Active cell & threads
  const [currentCell, setCurrentCell] = useState<EnrichedH3Cell>(() => {
    const initWp = SIMULATED_ROUTES[0].waypoints[0];
    const initH3 = coordinateToH3(initWp.coordinate, 8);
    return getEnrichedDataForWaypoint(initWp.name, initH3);
  });
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

  // Subscribe to audio state
  useEffect(() => {
    const unsub = audioService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
    };
  }, []);

  // Subscribe to Real GPS state
  useEffect(() => {
    let lastResolvedH3 = "";

    const unsubGps = realGpsService.subscribe(async (state) => {
      setGpsState(state);
      // Immediately resolve the real location as soon as GPS coordinates arrive
      if (state.status === "locked" && state.coordinate && state.h3Index && state.h3Index !== lastResolvedH3) {
        lastResolvedH3 = state.h3Index;
        const cell = await DynamicHeritageService.resolveCell(state.h3Index, state.coordinate);
        setCurrentCell(cell);
        if (!isAudioMuted && cell.teaserScript) {
          audioService.speak(cell.teaserScript);
        }
      }
    });

    const unsubCell = realGpsService.onCellEntry(async (newH3Id, coord) => {
      lastResolvedH3 = newH3Id;
      const cell = await DynamicHeritageService.resolveCell(newH3Id, coord);
      setCurrentCell(cell);
      setActiveThread(null);
      if (!isAudioMuted && cell.teaserScript) {
        audioService.speak(cell.teaserScript);
      }
    });

    return () => {
      unsubGps();
      unsubCell();
    };
  }, [isAudioMuted]);

  // Handle Real GPS Start/Stop
  const handleStartGps = async () => {
    audioService.unlockMobileAudio();
    voiceCommandService.startListening();
    await realGpsService.startTracking();
    // Immediate voice feedback unlocked by user gesture
    if (!isAudioMuted && currentCell.teaserScript) {
      audioService.speak(currentCell.teaserScript);
    }
  };

  const handleStopGps = () => {
    voiceCommandService.stopListening();
    realGpsService.stopTracking();
    audioService.stop();
  };

  // Simulator: derived waypoints & bearing
  const simWaypoint = currentRoute.waypoints[currentWaypointIndex];
  const nextSimWaypoint = currentRoute.waypoints[(currentWaypointIndex + 1) % currentRoute.waypoints.length];
  const simBearing = calculateBearing(simWaypoint.coordinate, nextSimWaypoint.coordinate);

  // Simulator waypoint update
  useEffect(() => {
    if (drivingMode === 'simulator') {
      const h3Idx = coordinateToH3(simWaypoint.coordinate, 8);
      const cell = getEnrichedDataForWaypoint(simWaypoint.name, h3Idx);
      setCurrentCell(cell);
      setActiveThread(null);
      if (!isAudioMuted && isPlaying && cell.teaserScript) {
        audioService.speak(cell.teaserScript);
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
      voiceCommandService.startListening();
      if (!isAudioMuted && currentCell.teaserScript) {
        audioService.speak(currentCell.teaserScript);
      }
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
    if (currentCell.teaserScript) {
      audioService.speak(currentCell.teaserScript);
    }
  };

  const handleSelectWaypoint = (index: number) => {
    audioService.stop();
    setCurrentWaypointIndex(index);
    setActiveThread(null);
    const wp = currentRoute.waypoints[index];
    const h3Idx = coordinateToH3(wp.coordinate, 8);
    const cell = getEnrichedDataForWaypoint(wp.name, h3Idx);
    setCurrentCell(cell);
    if (!isAudioMuted && cell.teaserScript) {
      audioService.speak(cell.teaserScript);
    }
  };

  const handlePullThread = (thread: ThreadOption) => {
    setActiveThread(thread);
    audioService.speak(thread.spokenNarrative);

    // Save thread to scrapbook
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
        const text = `You are in the townland of ${currentCell.townland}, County ${currentCell.county}. ${currentCell.teaserScript}`;
        audioService.speak(text);
      } else if (cmd === 'tell_me_more') {
        if (currentCell.threads && currentCell.threads.length > 0) {
          handlePullThread(currentCell.threads[0]);
        }
      } else if (cmd === 'stop_audio') {
        audioService.stop();
      }
    });

    return () => {
      unsubVoice();
      unsubCmd();
    };
  }, [currentCell]);

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
            setDrivingMode={setDrivingMode}
            gpsState={gpsState}
            onStartGps={handleStartGps}
            onStopGps={handleStopGps}
            voiceState={voiceState}
            hasElevenApiKey={audioService.hasApiKey()}
            audioLastError={audioService.getLastError()}
            onOpenVoiceStudio={() => setIsVoiceModalOpen(true)}
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

        {activeTab === 'map' && (
          <MapExplorerView
            currentRoute={currentRoute}
            currentWaypointIndex={currentWaypointIndex}
            currentCell={currentCell}
            onSelectWaypoint={handleSelectWaypoint}
          />
        )}

        {activeTab === 'dev' && (
          <DevShowcaseView currentCell={currentCell} />
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
            <span className="text-slate-500">Hardware GPS • Uber H3 • LangGraph • ElevenLabs • Logainm</span>
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
