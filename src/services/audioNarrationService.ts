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
  private currentAudioElement: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private preferredWebVoice: SpeechSynthesisVoice | null = null;
  private listeners: Set<(speaking: boolean) => void> = new Set();
  
  // Audio blob cache to prevent re-billing ElevenLabs tokens on repeated cells
  private audioBlobCache: Map<string, string> = new Map();

  // Settings
  private provider: 'elevenlabs' | 'webspeech' = 'elevenlabs';
  private elevenApiKey: string = '';
  private selectedVoiceId: string = ELEVENLABS_VOICE_PRESETS[0].id;
  private modelId: string = 'eleven_turbo_v2_5';

  constructor() {
    if (typeof window !== 'undefined') {
      // Load saved settings from localStorage
      this.elevenApiKey = localStorage.getItem('elevenlabs_api_key') || '';
      this.selectedVoiceId = localStorage.getItem('elevenlabs_voice_id') || ELEVENLABS_VOICE_PRESETS[0].id;
      const savedProvider = localStorage.getItem('audio_provider');
      if (savedProvider === 'webspeech' || savedProvider === 'elevenlabs') {
        this.provider = savedProvider;
      } else {
        // Default to elevenlabs if key exists, otherwise webspeech with prompt
        this.provider = this.elevenApiKey ? 'elevenlabs' : 'webspeech';
      }

      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.initWebVoice();
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = () => this.initWebVoice();
        }
      }
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

  /**
   * Primary speech synthesis trigger. Uses ElevenLabs if API key configured and provider is set,
   * otherwise gracefully falls back to native Web Speech API.
   */
  public async speak(text: string, onEnd?: () => void): Promise<void> {
    if (this.isMuted) {
      onEnd?.();
      return;
    }

    this.stop();

    if (this.provider === 'elevenlabs' && this.elevenApiKey) {
      try {
        await this.speakWithElevenLabs(text, onEnd);
        return;
      } catch (err) {
        console.warn('ElevenLabs playback failed, falling back to Web Speech API:', err);
        // Fallback gracefully
        this.speakWithWebSpeech(text, onEnd);
        return;
      }
    }

    // Default Web Speech API
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
        throw new Error(`ElevenLabs API returned ${response.status}: ${errorText}`);
      }

      const blob = await response.blob();
      audioUrl = URL.createObjectURL(blob);
      this.audioBlobCache.set(cacheKey, audioUrl);
    }

    const audio = new Audio(audioUrl);
    this.currentAudioElement = audio;

    audio.onplay = () => {
      this.notify(true);
    };

    audio.onended = () => {
      this.notify(false);
      this.currentAudioElement = null;
      onEnd?.();
    };

    audio.onerror = (err) => {
      console.warn('Audio element error:', err);
      this.notify(false);
      this.currentAudioElement = null;
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
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.notify(false);
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
      return preset ? `${preset.name} (ElevenLabs AI)` : 'Custom ElevenLabs Voice';
    }
    return this.preferredWebVoice
      ? `${this.preferredWebVoice.name} (${this.preferredWebVoice.lang})`
      : 'Device System Voice';
  }
}

export const audioService = new AudioNarrationService();
