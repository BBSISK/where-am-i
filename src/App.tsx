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
import { EnrichedH3Cell, ThreadOption, SavedTripThread } from './types';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drive' | 'map' | 'dev'>('drive');
  const [currentRoute, setCurrentRoute] = useState(SIMULATED_ROUTES[0]);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isScrapbookOpen, setIsScrapbookOpen] = useState(false);
  const [, setVoiceVersion] = useState(0);

  // Active pulled thread state
  const [activeThread, setActiveThread] = useState<ThreadOption | null>(null);
  
  // Trip Scrapbook state (persisted to localStorage)
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

  const currentWaypoint = currentRoute.waypoints[currentWaypointIndex];
  const nextWaypoint = currentRoute.waypoints[(currentWaypointIndex + 1) % currentRoute.waypoints.length];

  // Derive spatial H3 index and enriched data
  const currentH3Index = coordinateToH3(currentWaypoint.coordinate, 8);
  const currentCell: EnrichedH3Cell = getEnrichedDataForWaypoint(currentWaypoint.name, currentH3Index);
  const bearing = calculateBearing(currentWaypoint.coordinate, nextWaypoint.coordinate);

  // When changing waypoint during active play, reset active thread and speak teaser
  useEffect(() => {
    setActiveThread(null);
    if (!isAudioMuted && isPlaying && currentCell.teaserScript) {
      audioService.speak(currentCell.teaserScript);
    }
  }, [currentWaypointIndex, currentRoute.id]);

  // Simulation timer loop
  useEffect(() => {
    if (!isPlaying) return;

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
  }, [isPlaying, playbackSpeed, currentRoute.waypoints.length]);

  const handleRouteChange = (routeId: string) => {
    const found = SIMULATED_ROUTES.find((r) => r.id === routeId);
    if (found) {
      audioService.stop();
      setCurrentRoute(found);
      setCurrentWaypointIndex(0);
      setActiveThread(null);
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      // Starting drive: immediately trigger speech for the first location teaser
      if (!isAudioMuted && currentCell.teaserScript) {
        audioService.speak(currentCell.teaserScript);
      }
    } else {
      audioService.stop();
    }
  };

  const handleReset = () => {
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
    if (!isAudioMuted && cell.teaserScript) {
      audioService.speak(cell.teaserScript);
    }
  };

  // Pull on a Thread Handler
  const handlePullThread = (thread: ThreadOption) => {
    setActiveThread(thread);
    audioService.speak(thread.spokenNarrative);

    // Save thread to scrapbook if not already present
    setSavedThreads((prev) => {
      if (prev.some((t) => t.id === thread.id)) return prev;
      const newEntry: SavedTripThread = {
        id: thread.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        h3Index: currentH3Index,
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAudioMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        isSpeaking={isSpeaking}
        currentRouteTitle={currentRoute.title}
        onOpenVoiceStudio={() => setIsVoiceModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'drive' && (
          <DriveModeView
            currentRoute={currentRoute}
            onRouteChange={handleRouteChange}
            availableRoutes={SIMULATED_ROUTES}
            currentWaypointIndex={currentWaypointIndex}
            totalWaypoints={currentRoute.waypoints.length}
            currentCell={currentCell}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            isSpeaking={isSpeaking}
            onReplayAudio={handleReplayAudio}
            bearing={bearing}
            onSelectWaypoint={handleSelectWaypoint}
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

      {/* Footer / Portfolio Anchor */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Where Am I? (Anseo) • Éire Spatial Intelligence</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500">Built with Uber H3 • LangGraph • ElevenLabs • Logainm • Dúchas</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <span>Included in Ask Barry Portfolio</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
