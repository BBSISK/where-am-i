class AudioNarrationService {
  private synth: SpeechSynthesis | null = null;
  private isMuted: boolean = false;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private listeners: Set<(speaking: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize Irish English, then British English, then generic English
    this.preferredVoice =
      voices.find(v => v.lang === 'en-IE') ||
      voices.find(v => v.lang.startsWith('en-GB') || v.name.includes('Ireland') || v.name.includes('UK')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      null;
  }

  public subscribe(listener: (speaking: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(speaking: boolean) {
    this.listeners.forEach(fn => fn(speaking));
  }

  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !this.synth) {
      onEnd?.();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
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

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
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

  public getVoiceName(): string {
    return this.preferredVoice ? `${this.preferredVoice.name} (${this.preferredVoice.lang})` : 'Default System Voice';
  }
}

export const audioService = new AudioNarrationService();
