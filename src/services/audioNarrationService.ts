export interface ElevenLabsVoicePreset {
  id: string;
  name: string;
  description: string;
  accent: string;
  isGuaranteedPremade?: boolean;
}

export const ELEVENLABS_VOICE_PRESETS: ElevenLabsVoicePreset[] = [
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George (Warm Celtic & British Heritage)',
    description: 'Warm, captivating British / Celtic heritage male narrator (official premade)',
    accent: 'Warm Celtic / UK (Male)',
    isGuaranteedPremade: true
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam (Expressive Storyteller)',
    description: 'Dynamic, deep and narrative-rich male voice for dramatic folklore passages',
    accent: 'Deep Storyteller (Male)',
    isGuaranteedPremade: true
  },
  {
    id: 'IKne3meq5aSn9XLyUdCD',
    name: 'Charlie (Conversational Host)',
    description: 'Casual, friendly driving companion male narrator',
    accent: 'Conversational (Male)',
    isGuaranteedPremade: true
  },
  {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni (Classic Radio)',
    description: 'Crisp, measured modulation ideal for automotive heads-up audio',
    accent: 'Radio Modulation (Male)',
    isGuaranteedPremade: true
  },
  {
    id: 'D38z5RcWu1voky8WS1ja',
    name: 'Fin (Irish Storyteller Clone)',
    description: 'Authentic Irish cadence (requires voice in your ElevenLabs library)',
    accent: 'Irish (West)',
    isGuaranteedPremade: false
  }
];

export interface AudioTrackInfo {
  trackId: string;
  text: string;
  charIndex: number;
  onEnd?: () => void;
}

class AudioNarrationService {
  private synth: SpeechSynthesis | null = null;
  private sharedAudioElement: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private preferredWebVoice: SpeechSynthesisVoice | null = null;
  private listeners: Set<(speaking: boolean) => void> = new Set();
  private stateListeners: Set<(state: 'idle' | 'loading' | 'playing' | 'paused', trackId: string | null) => void> = new Set();
  
  // Audio blob cache
  private audioBlobCache: Map<string, string> = new Map();

  // Execution session arbiter & cancellation controller
  private currentSessionId: number = 0;
  private abortController: AbortController | null = null;

  // Track & Playback state
  private currentTrack: AudioTrackInfo | null = null;
  private playbackState: 'idle' | 'loading' | 'playing' | 'paused' = 'idle';
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Settings
  private provider: 'elevenlabs' | 'webspeech' = 'elevenlabs';
  private elevenApiKey: string = '';
  // Default to George (official male premade voice)
  private selectedVoiceId: string = ELEVENLABS_VOICE_PRESETS[0].id;
  private modelId: string = 'eleven_turbo_v2_5';
  private lastErrorMessage: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const envKey = (import.meta as any).env?.VITE_ELEVENLABS_API_KEY;
      const localKey = localStorage.getItem('elevenlabs_api_key');
      this.elevenApiKey = (envKey || localKey || '').trim().replace(/^["']|["']$/g, '');
      
      const savedVoiceId = localStorage.getItem('elevenlabs_voice_id');
      // Always ensure valid default (avoid stale 404 Fin voice)
      if (!savedVoiceId || savedVoiceId === 'D38z5RcWu1voky8WS1ja') {
        this.selectedVoiceId = ELEVENLABS_VOICE_PRESETS[0].id;
      } else {
        this.selectedVoiceId = savedVoiceId;
      }

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
   * Discovers the user's available custom and premade voices directly from ElevenLabs.
   */
  public async fetchUserVoices(key?: string): Promise<Array<{ id: string; name: string; category?: string }>> {
    const k = (key || this.elevenApiKey || '').trim();
    if (!k || k.length < 5) return [];

    try {
      const resp = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': k }
      });
      if (!resp.ok) return [];
      const data = await resp.json();
      return (data.voices || []).map((v: any) => ({
        id: v.voice_id,
        name: v.name,
        category: v.category || (v.labels?.accent ? `${v.labels.accent}` : 'Voice')
      }));
    } catch {
      return [];
    }
  }

  /**
   * Prime mobile Safari audio subsystem on initial tap
   */
  public unlockMobileAudio(): void {
    if (this.sharedAudioElement) {
      this.sharedAudioElement.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      this.sharedAudioElement.play().catch(() => {});
    }
  }

  private initWebVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Check saved manual preference
    const savedVoiceUri = typeof window !== 'undefined' ? localStorage.getItem('preferred_web_voice_uri') : null;
    if (savedVoiceUri) {
      const found = voices.find(v => v.voiceURI === savedVoiceUri);
      if (found) {
        this.preferredWebVoice = found;
        return;
      }
    }

    // Comprehensive blacklist of default female synthesized voices
    const femaleNames = [
      'moira', 'samantha', 'victoria', 'karen', 'serena', 'fiona', 'tessa', 'siri',
      'kate', 'susan', 'zoe', 'ava', 'allison', 'nicky', 'stephanie', 'alice', 'veena',
      'claire', 'yuna', 'amelie', 'kyoko', 'sin-ji', 'ting-ting', 'mónica'
    ];
    
    // Priority 1: Male Celtic / British voices (George, Daniel, Oliver, Arthur, Malcolm, Graham)
    const maleCelticOrBritish = voices.find(v => {
      const name = v.name.toLowerCase();
      const isEnglish = v.lang.startsWith('en');
      const isMale = (
        name.includes('george') ||
        name.includes('daniel') ||
        name.includes('oliver') ||
        name.includes('arthur') ||
        name.includes('malcolm') ||
        name.includes('graham') ||
        name.includes('male')
      ) && !femaleNames.some(f => name.includes(f));
      return isEnglish && isMale;
    });

    // Priority 2: Any English male voice (Alex, Fred, Aaron, Rishi, etc.)
    const anyMaleEnglish = voices.find(v => {
      const name = v.name.toLowerCase();
      const isEnglish = v.lang.startsWith('en');
      const isMale = (name.includes('alex') || name.includes('fred') || name.includes('aaron') || name.includes('rishi') || name.includes('gordon')) && !femaleNames.some(f => name.includes(f));
      return isEnglish && isMale;
    });

    // Priority 3: Any English voice that is NOT explicitly on the female voice list
    const nonFemaleEnglish = voices.find(v => {
      const name = v.name.toLowerCase();
      return v.lang.startsWith('en') && !femaleNames.some(f => name.includes(f));
    });

    this.preferredWebVoice = maleCelticOrBritish || anyMaleEnglish || nonFemaleEnglish || voices.find(v => v.lang.startsWith('en')) || null;
  }

  public getAvailableWebVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    return voices.filter(v => v.lang.startsWith('en'));
  }

  public setPreferredWebVoice(voiceURI: string) {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    const found = voices.find(v => v.voiceURI === voiceURI);
    if (found) {
      this.preferredWebVoice = found;
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred_web_voice_uri', voiceURI);
      }
    }
  }

  public subscribe(listener: (speaking: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribePlaybackState(listener: (state: 'idle' | 'loading' | 'playing' | 'paused', trackId: string | null) => void) {
    this.stateListeners.add(listener);
    listener(this.playbackState, this.getCurrentTrackId());
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private notify(speaking: boolean) {
    this.listeners.forEach((fn) => fn(speaking));
    this.stateListeners.forEach((fn) => fn(this.playbackState, this.getCurrentTrackId()));
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
    this.selectedVoiceId = voiceId.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('elevenlabs_voice_id', this.selectedVoiceId);
    }
  }

  public getVoiceId(): string {
    return this.selectedVoiceId;
  }

  public getLastError(): string | null {
    return this.lastErrorMessage;
  }

  public getPlaybackState(): 'idle' | 'loading' | 'playing' | 'paused' {
    return this.playbackState;
  }

  public getCurrentTrackId(): string | null {
    return this.currentTrack?.trackId || null;
  }

  public isTrackPlaying(trackId: string): boolean {
    return this.playbackState === 'playing' && this.currentTrack?.trackId === trackId;
  }

  public isTrackPaused(trackId: string): boolean {
    return this.playbackState === 'paused' && this.currentTrack?.trackId === trackId;
  }

  public isTrackLoading(trackId: string): boolean {
    return this.playbackState === 'loading' && this.currentTrack?.trackId === trackId;
  }

  public isPaused(): boolean {
    return this.playbackState === 'paused';
  }

  /**
   * Toggles playback for a track ID:
   * - If currently playing this track -> pauses it immediately.
   * - If currently paused on this track -> resumes it right from where it paused.
   * - If loading -> stops and cancels request.
   * - Otherwise -> starts this track fresh.
   */
  public async toggleTrack(trackId: string, text: string, onEnd?: () => void): Promise<void> {
    if (this.isTrackPlaying(trackId)) {
      this.pause();
    } else if (this.isTrackPaused(trackId)) {
      this.resume();
    } else if (this.isTrackLoading(trackId)) {
      this.stop();
    } else {
      await this.speak(text, { trackId, onEnd });
    }
  }

  /**
   * Strict Exclusive Audio Dispatcher.
   * Guaranteed: ONLY ONE voice can ever produce sound at any moment.
   */
  public async speak(
    text: string,
    options?: { trackId?: string; onEnd?: () => void } | (() => void)
  ): Promise<void> {
    const onEnd = typeof options === 'function' ? options : options?.onEnd;
    const trackId = typeof options === 'object' && options?.trackId ? options.trackId : `track-${Date.now()}`;

    // 1. Immediately kill all existing sound and cancel in-flight requests
    this.stop();

    if (this.isMuted) {
      onEnd?.();
      return;
    }

    const sessionId = ++this.currentSessionId;
    this.lastErrorMessage = null;
    this.currentTrack = { trackId, text, charIndex: 0, onEnd };
    this.playbackState = 'loading';

    // Route exclusively to the configured provider:
    if (this.provider === 'elevenlabs' && this.hasApiKey()) {
      try {
        await this.speakWithElevenLabs(sessionId, text, () => {
          if (this.currentSessionId === sessionId) {
            this.playbackState = 'idle';
            this.currentTrack = null;
            this.notify(false);
            onEnd?.();
          }
        });
      } catch (err: any) {
        if (this.currentSessionId === sessionId) {
          this.lastErrorMessage = err?.message || 'ElevenLabs error';
          console.warn('ElevenLabs playback failed:', err);
          this.playbackState = 'idle';
          this.currentTrack = null;
          this.notify(false);
          onEnd?.();
        }
      }
      return;
    }

    // Otherwise use Native Web Speech (Never run both!)
    this.speakWithWebSpeech(sessionId, text, () => {
      if (this.currentSessionId === sessionId) {
        this.playbackState = 'idle';
        this.currentTrack = null;
        this.notify(false);
        onEnd?.();
      }
    });
  }

  private async speakWithElevenLabs(sessionId: number, text: string, onEnd?: () => void): Promise<void> {
    const cacheKey = `${this.selectedVoiceId}_${text}`;
    let audioUrl = this.audioBlobCache.get(cacheKey);

    if (!audioUrl) {
      this.abortController = new AbortController();

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.selectedVoiceId}`, {
        method: 'POST',
        signal: this.abortController.signal,
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
            style: 0.25,
            use_speaker_boost: true
          }
        })
      });

      // If user stopped while fetching, abort immediately
      if (this.currentSessionId !== sessionId) {
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      if (this.currentSessionId !== sessionId) {
        return;
      }

      audioUrl = URL.createObjectURL(blob);
      this.audioBlobCache.set(cacheKey, audioUrl);
    }

    if (this.currentSessionId !== sessionId) {
      return;
    }

    if (!this.sharedAudioElement) {
      this.sharedAudioElement = new Audio();
    }

    const audio = this.sharedAudioElement;
    audio.src = audioUrl;

    audio.onplay = () => {
      if (this.currentSessionId === sessionId) {
        this.playbackState = 'playing';
        this.notify(true);
      }
    };

    audio.onended = () => {
      if (this.currentSessionId === sessionId) {
        this.playbackState = 'idle';
        this.currentTrack = null;
        this.notify(false);
        onEnd?.();
      }
    };

    audio.onerror = (err) => {
      if (this.currentSessionId === sessionId) {
        console.warn('Audio playback error:', err);
        this.playbackState = 'idle';
        this.currentTrack = null;
        this.notify(false);
        onEnd?.();
      }
    };

    // Prime buffer before playing to avoid frame dropouts / stutter
    await new Promise<void>((resolve) => {
      if (audio.readyState >= 3) {
        resolve();
        return;
      }
      const onCanPlay = () => {
        audio.removeEventListener('canplay', onCanPlay);
        resolve();
      };
      audio.addEventListener('canplay', onCanPlay);
      setTimeout(() => {
        audio.removeEventListener('canplay', onCanPlay);
        resolve();
      }, 350);
    });

    if (this.currentSessionId !== sessionId) {
      return;
    }

    try {
      await audio.play();
    } catch (e: any) {
      if (this.currentSessionId === sessionId) {
        console.warn('Audio play failed:', e);
        this.playbackState = 'idle';
        this.currentTrack = null;
        this.notify(false);
        onEnd?.();
      }
    }
  }

  private speakWithWebSpeech(sessionId: number, text: string, onEnd?: () => void, startCharIndex = 0): void {
    if (!this.synth) {
      onEnd?.();
      return;
    }

    this.initWebVoice();
    const textToSpeak = startCharIndex > 0 ? text.slice(startCharIndex) : text;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    this.currentUtterance = utterance;

    if (this.preferredWebVoice) {
      utterance.voice = this.preferredWebVoice;
    }
    utterance.lang = this.preferredWebVoice?.lang || 'en-GB';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Track word boundary so pause & resume works seamlessly without restarting from word 0
    utterance.onboundary = (event) => {
      if (this.currentTrack && (event.name === 'word' || (event as any).charIndex !== undefined)) {
        this.currentTrack.charIndex = startCharIndex + event.charIndex;
      }
    };

    utterance.onstart = () => {
      if (this.currentSessionId === sessionId && this.currentUtterance === utterance) {
        this.playbackState = 'playing';
        this.notify(true);
      }
    };

    utterance.onend = () => {
      if (this.currentSessionId === sessionId && this.currentUtterance === utterance) {
        this.playbackState = 'idle';
        this.currentTrack = null;
        this.currentUtterance = null;
        this.notify(false);
        onEnd?.();
      }
    };

    utterance.onerror = () => {
      if (this.playbackState === 'paused') {
        return;
      }
      if (this.currentSessionId === sessionId && this.currentUtterance === utterance) {
        this.playbackState = 'idle';
        this.currentTrack = null;
        this.currentUtterance = null;
        this.notify(false);
        onEnd?.();
      }
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    // Increment session ID to immediately invalidate any pending in-flight async operations
    ++this.currentSessionId;
    
    // Abort pending fetch
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.playbackState = 'idle';
    this.currentTrack = null;
    this.currentUtterance = null;

    // 1. Hard silence HTMLAudio
    if (this.sharedAudioElement) {
      this.sharedAudioElement.pause();
      this.sharedAudioElement.currentTime = 0;
      this.sharedAudioElement.removeAttribute('src');
      this.sharedAudioElement.load();
    }

    // 2. Hard silence Web Speech
    if (this.synth) {
      this.synth.cancel();
    }

    this.notify(false);
  }

  public pause(): void {
    if (this.playbackState !== 'playing' || !this.currentTrack) return;

    this.playbackState = 'paused';

    if (this.provider === 'elevenlabs' && this.sharedAudioElement) {
      this.sharedAudioElement.pause();
    } else if (this.synth) {
      // Cancel speech cleanly so audio halts immediately; resume will continue from charIndex
      this.synth.cancel();
      this.currentUtterance = null;
    }

    this.notify(false);
  }

  public resume(): void {
    if (this.playbackState !== 'paused' || !this.currentTrack) return;

    this.playbackState = 'playing';

    if (this.provider === 'elevenlabs' && this.sharedAudioElement) {
      // NOTE: Do NOT increment currentSessionId for ElevenLabs!
      // The audio element is simply unpaused, and preserving the session ID ensures
      // that the attached audio.onended handler matches and cleans up properly upon completion.
      this.sharedAudioElement.play().catch((err) => {
        console.warn('ElevenLabs resume failed:', err);
        this.playbackState = 'paused';
        this.notify(false);
      });
      this.notify(true);
    } else if (this.synth) {
      // For Web Speech, dispatch a new utterance starting from the exact word where it was paused
      const sessionId = ++this.currentSessionId;
      const resumeFrom = this.currentTrack.charIndex || 0;
      this.speakWithWebSpeech(sessionId, this.currentTrack.text, this.currentTrack.onEnd, resumeFrom);
      this.notify(true);
    }
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
    if (this.provider === 'elevenlabs' && this.hasApiKey()) {
      const preset = ELEVENLABS_VOICE_PRESETS.find(p => p.id === this.selectedVoiceId);
      return preset ? `${preset.name} (ElevenLabs)` : `Custom ElevenLabs (${this.selectedVoiceId.slice(0, 6)}…)`;
    }
    return this.preferredWebVoice
      ? `${this.preferredWebVoice.name} (Male Narrator)`
      : 'George / Male Narrator';
  }
}

export const audioService = new AudioNarrationService();
