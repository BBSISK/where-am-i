import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Key,
  Check,
  Play,
  Square,
  AlertCircle
} from 'lucide-react';
import { audioService, ELEVENLABS_VOICE_PRESETS } from '../services/audioNarrationService';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved
}) => {
  const [provider, setProvider] = useState<'elevenlabs' | 'webspeech'>(audioService.getProvider());
  const [apiKey, setApiKey] = useState(audioService.getApiKey());
  const [voiceId, setVoiceId] = useState(audioService.getVoiceId());
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    audioService.setApiKey(apiKey);
    audioService.setVoiceId(voiceId);
    audioService.setProvider(provider);
    onSettingsSaved();
    onClose();
  };

  const handleTestVoice = async () => {
    setTestError(null);
    setIsTesting(true);
    // Temporary set to test
    audioService.setApiKey(apiKey);
    audioService.setVoiceId(voiceId);
    audioService.setProvider(provider);

    const sampleText =
      provider === 'elevenlabs'
        ? "Dia dhuit! You are now driving through Connemara, where ancient Irish granite and blanket bogs meet the Atlantic Ocean."
        : "Welcome to Ireland. Entering the townland of Galway, home to the ancient Claddagh and the River Corrib.";

    try {
      await audioService.speak(sampleText, () => {
        setIsTesting(false);
      });
    } catch (err: any) {
      setTestError(err?.message || 'Failed to play sample audio');
      setIsTesting(false);
    }
  };

  const handleStopTest = () => {
    audioService.stop();
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Audio Narration Studio</h3>
              <p className="text-xs text-slate-400 font-mono">Configure ElevenLabs Emotive Voices or System Fallback</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Provider Switcher */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Speech Synthesis Engine
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* ElevenLabs Card */}
            <div
              onClick={() => setProvider('elevenlabs')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                provider === 'elevenlabs'
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-amber-400 flex items-center gap-2">
                  <span>ElevenLabs AI Voice</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    Recommended
                  </span>
                </span>
                {provider === 'elevenlabs' && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Hyper-realistic, emotive Irish storyteller and broadcaster voice models.
              </p>
            </div>

            {/* Native Web Speech Card */}
            <div
              onClick={() => setProvider('webspeech')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                provider === 'webspeech'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <span>Device System Voice</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    Free / Offline
                  </span>
                </span>
                {provider === 'webspeech' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Runs on device via Web Speech API. Zero API key required, works offline.
              </p>
            </div>

          </div>
        </div>

        {/* ElevenLabs Settings Panel */}
        {provider === 'elevenlabs' && (
          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            
            {/* API Key Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>ElevenLabs API Key</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">Saved in browser localStorage</span>
              </div>
              <input
                type="password"
                placeholder="sk_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <p className="text-[11px] text-slate-500">
                Don't have a key? Get a free key at <a href="https://elevenlabs.io" target="_blank" rel="noreferrer" className="text-amber-400 underline">elevenlabs.io</a> (10,000 free characters/month).
              </p>
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Selected Storyteller Voice
              </label>
              <div className="space-y-2">
                {ELEVENLABS_VOICE_PRESETS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setVoiceId(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      voiceId === p.id
                        ? 'bg-slate-950 border-amber-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{p.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
                          {p.accent}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{p.description}</p>
                    </div>

                    <div className="w-5 h-5 rounded-full border flex items-center justify-center border-slate-700">
                      {voiceId === p.id && <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message if API fails */}
            {testError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{testError}</span>
              </div>
            )}

          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={isTesting ? handleStopTest : handleTestVoice}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition-all"
          >
            {isTesting ? <Square className="w-3.5 h-3.5 fill-current text-rose-400" /> : <Play className="w-3.5 h-3.5 fill-current text-amber-400" />}
            <span>{isTesting ? 'Stop Sample' : 'Test Voice Audio'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold shadow-lg shadow-amber-600/20 transition-all"
            >
              Apply Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
