import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DriveModeView } from './components/DriveModeView';
import { MapExplorerView } from './components/MapExplorerView';
import { DevShowcaseView } from './components/DevShowcaseView';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { SIMULATED_ROUTES } from './data/irelandRoutes';
import { getEnrichedDataForWaypoint } from './data/heritageKnowledgeBase';
import { coordinateToH3, calculateBearing } from './services/spatialEngine';
import { audioService } from './services/audioNarrationService';
import { EnrichedH3Cell } from './types';
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
  const [, setVoiceVersion] = useState(0); // Force re-render on voice change

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

  // Trigger narration when entering a new waypoint
  useEffect(() => {
    if (!isAudioMuted && currentCell.narrativeScript) {
      audioService.speak(currentCell.narrativeScript);
    }
  }, [currentWaypointIndex, currentRoute.id]);

  // Simulation timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 7000 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentWaypointIndex((prev) => {
        if (prev + 1 >= currentRoute.waypoints.length) {
          setIsPlaying(false);
          return 0; // Loop or stop
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
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    audioService.stop();
    setCurrentWaypointIndex(0);
    setIsPlaying(false);
  };

  const handleToggleMute = () => {
    const muted = audioService.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleReplayAudio = () => {
    if (currentCell.narrativeScript) {
      audioService.speak(currentCell.narrativeScript);
    }
  };

  const handleSelectWaypoint = (index: number) => {
    audioService.stop();
    setCurrentWaypointIndex(index);
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
