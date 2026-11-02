import React from 'react';
import { Volume2, VolumeX, Navigation, Map, Sparkles, Mic } from 'lucide-react';
import { audioService } from '../services/audioNarrationService';

interface NavbarProps {
  activeTab: 'drive' | 'map';
  setActiveTab: (tab: 'drive' | 'map') => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
  isSpeaking: boolean;
  currentRouteTitle: string;
  onOpenVoiceStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAudioMuted,
  onToggleMute,
  isSpeaking,
  currentRouteTitle,
  onOpenVoiceStudio
}) => {
  const isElevenLabs = audioService.getProvider() === 'elevenlabs';
  const voiceLabel = audioService.getVoiceLabel();

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl tracking-wider">
            É
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">WHERE AM I?</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-medium border border-emerald-500/30">
                Anseo
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {currentRouteTitle}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'drive'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span className="hidden xs:inline">Drive Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden xs:inline">H3 Hex Map</span>
          </button>

        </nav>

        {/* Voice Studio Button & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Voice Studio Selector Button */}
          <button
            onClick={onOpenVoiceStudio}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${
              isElevenLabs
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Configure ElevenLabs Emotive Voices"
          >
            {isElevenLabs ? <Sparkles className="w-3.5 h-3.5 text-amber-400" /> : <Mic className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline truncate max-w-[140px]">{voiceLabel.split(' (')[0]}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
              {isElevenLabs ? 'ElevenLabs' : 'Device'}
            </span>
          </button>

          {isSpeaking && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Broadcasting</span>
            </div>
          )}

          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-all ${
              isAudioMuted
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title={isAudioMuted ? 'Unmute Ambient Audio Guide' : 'Mute Audio Guide'}
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};
