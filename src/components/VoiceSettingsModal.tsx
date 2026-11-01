import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Key,
  Check,
  Play,
  Square,
  AlertCircle,
  RefreshCw,
  Sliders
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
  const [customVoiceId, setCustomVoiceId] = useState('');
  const [userVoices, setUserVoices] = useState<Array<{ id: string; name: string; category?: string }>>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState(false);

  // Web Speech voices
  const [webVoices, setWebVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (isOpen) {
      setApiKey(audioService.getApiKey());
      setVoiceId(audioService.getVoiceId());
      setProvider(audioService.getProvider());
      setTestError(null);
      setTestSuccess(false);

      if (audioService.hasApiKey()) {
        loadUserVoices(audioService.getApiKey());
      }

      setWebVoices(audioService.getAvailableWebVoices());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const loadUserVoices = async (key: string) => {
    if (!key || key.length < 5) return;
    setIsLoadingVoices(true);
    try {
      const voices = await audioService.fetchUserVoices(key);
      setUserVoices(voices);
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const handleSave = () => {
    const finalVoice = customVoiceId.trim() || voiceId;
    audioService.setApiKey(apiKey);
    audioService.setVoiceId(finalVoice);
    audioService.setProvider(provider);
    onSettingsSaved();
    onClose();
  };

  const handleTestVoice = async () => {
    setTestError(null);
    setTestSuccess(false);
    setIsTesting(true);

    const activeKey = apiKey.trim();
    const finalVoice = customVoiceId.trim() || voiceId;

    // Apply temporarily for test
    audioService.setApiKey(activeKey);
    audioService.setVoiceId(finalVoice);
    audioService.setProvider(provider);

    const sampleText =
      provider === 'elevenlabs'
        ? "Dia dhuit! You are now driving through Ireland, where ancient monuments and blanket bogs meet the Atlantic."
        : "Welcome to Ireland. Locating your Irish townland and streaming ambient local heritage.";

    try {
      await audioService.speak(sampleText, {
        trackId: 'test-voice',
        onEnd: () => {
          setIsTesting(false);
          setTestSuccess(true);
        }
      });
      // Check if there was an immediate error recorded
      const err = audioService.getLastError();
      if (err) {
        setTestError(err);
      } else {
        setTestSuccess(true);
      }
    } catch (err: any) {
      setTestError(err?.message || 'Voice test failed');
    } finally {
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
              <p className="text-xs text-slate-400 font-mono">Configure Storyteller Voice & ElevenLabs Emotive Models</p>
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
                Hyper-realistic, emotive storyteller and broadcaster voices.
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
                Runs on device via Web Speech API. Works offline with zero API key.
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
                {audioService.isEnvKeyConfigured() && (
                  <span className="text-[10px] font-mono text-emerald-400">Render Env Configured</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="sk_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => loadUserVoices(apiKey)}
                  disabled={isLoadingVoices || !apiKey}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                  title="Fetch voices from your ElevenLabs account"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingVoices ? 'animate-spin' : ''}`} />
                  <span>Discover</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Key is stored safely in your browser. Get a key at <a href="https://elevenlabs.io" target="_blank" rel="noreferrer" className="text-amber-400 underline">elevenlabs.io</a>.
              </p>
            </div>

            {/* User Account Voices (if discovered) */}
            {userVoices.length > 0 && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-xs font-mono text-amber-300 font-bold block">
                  ✨ Voices in Your ElevenLabs Account ({userVoices.length})
                </span>
                <select
                  value={voiceId}
                  onChange={(e) => {
                    setVoiceId(e.target.value);
                    setCustomVoiceId('');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {userVoices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.category || 'Custom'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Guaranteed Official Premade Voices */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Standard Storyteller Voices
              </label>
              <div className="space-y-2">
                {ELEVENLABS_VOICE_PRESETS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setVoiceId(p.id);
                      setCustomVoiceId('');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      voiceId === p.id && !customVoiceId
                        ? 'bg-slate-950 border-amber-500 text-white ring-1 ring-amber-500/50'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{p.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
                          {p.accent}
                        </span>
                        {p.isGuaranteedPremade && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                            Universal
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                    </div>

                    {voiceId === p.id && !customVoiceId && (
                      <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Voice ID entry */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-slate-400" />
                <span>Custom Voice ID (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 21m00Tcm4TlvDq8ikWAM or cloned Irish voice ID"
                value={customVoiceId}
                onChange={(e) => setCustomVoiceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

          </div>
        )}

        {/* Web Speech Voice Options */}
        {provider === 'webspeech' && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Device Voices ({webVoices.length} available)
            </label>
            {webVoices.length > 0 ? (
              <select
                onChange={(e) => audioService.setPreferredWebVoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {webVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-slate-500 font-mono">
                Using system default English voice with Irish cadence tuning.
              </p>
            )}
          </div>
        )}

        {/* Error / Success Alerts */}
        {testError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Voice error: {testError}</span>
          </div>
        )}

        {testSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Voice playback verified successfully!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isTesting ? (
              <button
                type="button"
                onClick={handleStopTest}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Sample</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTestVoice}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold transition-all border border-slate-700"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Voice Sample</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              Save Voice Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
