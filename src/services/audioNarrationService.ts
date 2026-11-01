export interface ElevenLabsVoicePreset {
  id: string;
  name: string;
  description: string;
  accent: string;
}

export const ELEVENLABS_VOICE_PRESETS: ElevenLabsVoicePreset[] = [
  {
    id: 'D38z5RcWu1voky8WS1ja',
    name: 'Fin (Irish Storyteller)',
    description: 'Authentic Irish cadence with rich, grounded storytelling warmth',
    accent: 'Irish (Connacht / West)'
  },
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George (Historical Documentary)',
    description: 'Warm, captivating British / Celtic heritage narrator',
    accent: 'Warm Celtic / UK'
  },
  {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni (Classic Radio)',
    description: 'Crisp, measured modulation ideal for automotive heads-up audio',
    accent: 'Neutral Transatlantic'
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam (Expressive)',
    description: 'Dynamic and narrative-rich for dramatic folklore passages',
    accent: 'Narrative Deep'
  }
];

class AudioNarrationService {
  private synth: SpeechSynthesis | null = null;
  private sharedAudioElement: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private preferredWebVoice: SpeechSynthesisVoice | null = null;
  private listeners: Set<(speaking: boolean) => void> = new Set();
  
  // Audio blob cache
  private audioBlobCache: Map<string, string> = new Map();
  private _isPaused: boolean = false;

  // Settings
  private provider: 'elevenlabs' | 'webspeech' = 'elevenlabs';
  private elevenApiKey: string = '';
  private selectedVoiceId: string = ELEVENLABS_VOICE_PRESETS[0].id;
  private modelId: string = 'eleven_turbo_v2_5';
  private lastErrorMessage: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const envKey = (import.meta as any).env?.VITE_ELEVENLABS_API_KEY;
      const localKey = localStorage.getItem('elevenlabs_api_key');
      this.elevenApiKey = (envKey || localKey || '').trim();
      this.selectedVoiceId = localStorage.getItem('elevenlabs_voice_id') || ELEVENLABS_VOICE_PRESETS[0].id;

      if (this.elevenApiKey) {
        this.provider = 'elevenlabs';
      } else {
        const savedProvider = localStorage.getItem('audio_provider');
        this.provider = savedProvider === 'elevenlabs' ? 'elevenlabs' : 'webspeech';
      }

      // Pre-instantiate single shared audio element for mobile Safari compatibility
      this.sharedAudioElement = new Audio();

      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.initWebVoice();
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = () => this.initWebVoice();
        }
      }
    }
  }

  public isEnvKeyConfigured(): boolean {
    return Boolean((import.meta as any).env?.VITE_ELEVENLABS_API_KEY);
  }

  public hasApiKey(): boolean {
    return Boolean(this.elevenApiKey && this.elevenApiKey.length > 5);
  }

  /**
   * Must be called during a user touch/click gesture (e.g. tapping "Start Driving")
   * to prime mobile iOS Safari's audio subsystem for subsequent async playback.
   */
  public unlockMobileAudio(): void {
    if (this.sharedAudioElement) {
      // 10ms silent wave base64
      this.sharedAudioElement.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      this.sharedAudioElement.play().catch(() => {});
    }
  }

  private initWebVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.preferredWebVoice =
      voices.find(v => v.lang === 'en-IE') ||
      voices.find(v => v.lang.startsWith('en-GB') || v.name.includes('Ireland') || v.name.includes('UK')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      null;
  }

  public subscribe(listener: (speaking: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean) {
    this.listeners.forEach(fn => fn(speaking));
  }

  public setApiKey(key: string) {
    this.elevenApiKey = key.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('elevenlabs_api_key', this.elevenApiKey);
    }
    if (this.elevenApiKey) {
      this.setProvider('elevenlabs');
    }
  }

  public getApiKey(): string {
    return this.elevenApiKey;
  }

  public setProvider(provider: 'elevenlabs' | 'webspeech') {
    this.provider = provider;
    if (typeof window !== 'undefined') {
      localStorage.setItem('audio_provider', provider);
    }
  }

  public getProvider(): 'elevenlabs' | 'webspeech' {
    return this.provider;
  }

  public setVoiceId(voiceId: string) {
    this.selectedVoiceId = voiceId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('elevenlabs_voice_id', voiceId);
    }
  }

  public getVoiceId(): string {
    return this.selectedVoiceId;
  }

  public getLastError(): string | null {
    return this.lastErrorMessage;
  }

  public async speak(text: string, onEnd?: () => void): Promise<void> {
    if (this.isMuted) {
      onEnd?.();
      return;
    }

    this.stop();
    this._isPaused = false;
    this.lastErrorMessage = null;

    if (this.provider === 'elevenlabs' && this.elevenApiKey) {
      try {
        await this.speakWithElevenLabs(text, onEnd);
        return;
      } catch (err: any) {
        this.lastErrorMessage = err?.message || 'ElevenLabs error';
        console.warn('ElevenLabs playback failed:', err);
        // Fallback to Web Speech API
        this.speakWithWebSpeech(text, onEnd);
        return;
      }
    }

    this.speakWithWebSpeech(text, onEnd);
  }

  private async speakWithElevenLabs(text: string, onEnd?: () => void): Promise<void> {
    const cacheKey = `${this.selectedVoiceId}_${text}`;
    let audioUrl = this.audioBlobCache.get(cacheKey);

    if (!audioUrl) {
      this.notify(true);
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.elevenApiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: this.modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      audioUrl = URL.createObjectURL(blob);
      this.audioBlobCache.set(cacheKey, audioUrl);
    }

    if (!this.sharedAudioElement) {
      this.sharedAudioElement = new Audio();
    }

    const audio = this.sharedAudioElement;
    audio.src = audioUrl;

    audio.onplay = () => {
      this.notify(true);
    };

    audio.onended = () => {
      this.notify(false);
      onEnd?.();
    };

    audio.onerror = (err) => {
      console.warn('Audio playback error:', err);
      this.notify(false);
      onEnd?.();
    };

    await audio.play();
  }

  private speakWithWebSpeech(text: string, onEnd?: () => void): void {
    if (!this.synth) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.preferredWebVoice) {
      utterance.voice = this.preferredWebVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.02;

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      onEnd?.();
    };

    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
      this.notify(false);
      onEnd?.();
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    this._isPaused = false;
    if (this.sharedAudioElement) {
      this.sharedAudioElement.pause();
      this.sharedAudioElement.currentTime = 0;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.notify(false);
  }

  public pause(): void {
    if (this.sharedAudioElement && !this.sharedAudioElement.paused) {
      this.sharedAudioElement.pause();
      this._isPaused = true;
      this.notify(false);
    } else if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this._isPaused = true;
      this.notify(false);
    }
  }

  public resume(): void {
    if (this.sharedAudioElement && this._isPaused) {
      this.sharedAudioElement.play().catch(console.warn);
      this._isPaused = false;
      this.notify(true);
    } else if (this.synth && this.synth.paused) {
      this.synth.resume();
      this._isPaused = false;
      this.notify(true);
    }
  }

  public isPaused(): boolean {
    return this._isPaused;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getVoiceLabel(): string {
    if (this.provider === 'elevenlabs') {
      const preset = ELEVENLABS_VOICE_PRESETS.find(p => p.id === this.selectedVoiceId);
      return preset ? `${preset.name} (ElevenLabs)` : 'Custom ElevenLabs Voice';
    }
    return this.preferredWebVoice
      ? `${this.preferredWebVoice.name} (${this.preferredWebVoice.lang})`
      : 'Device System Voice';
  }
}

export const audioService = new AudioNarrationService();
