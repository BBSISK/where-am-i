export interface VoiceCommandState {
  isSupported: boolean;
  isListening: boolean;
  lastHeardPhrase: string;
  commandDetected: string | null;
}

class VoiceCommandService {
  private recognition: any = null;
  private isListeningActive: boolean = false;
  private listeners: Set<(state: VoiceCommandState) => void> = new Set();
  private commandCallbacks: Set<(cmd: 'tell_me_more' | 'stop_audio') => void> = new Set();

  private currentState: VoiceCommandState = {
    isSupported: false,
    isListening: false,
    lastHeardPhrase: '',
    commandDetected: null
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.currentState.isSupported = true;
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          try {
            rec.lang = 'en-IE';
          } catch (e) {
            rec.lang = 'en-US';
          }

          rec.onresult = (event: any) => this.handleSpeechResult(event);
          rec.onend = () => {
            // Auto-restart if user still wants listening active while driving
            if (this.isListeningActive) {
              try {
                rec.start();
              } catch (e) {
                // If immediate restart fails, try again shortly
                setTimeout(() => {
                  if (this.isListeningActive) {
                    try { rec.start(); } catch (err) {}
                  }
                }, 500);
              }
            } else {
              this.currentState.isListening = false;
              this.notify();
            }
          };
          rec.onerror = (err: any) => {
            if (err.error !== 'no-speech') {
              console.warn('SpeechRecognition error:', err);
            }
          };

          this.recognition = rec;
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
        }
      }
    }
  }

  public subscribe(listener: (state: VoiceCommandState) => void) {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onCommand(callback: (cmd: 'tell_me_more' | 'stop_audio') => void) {
    this.commandCallbacks.add(callback);
    return () => {
      this.commandCallbacks.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn({ ...this.currentState }));
  }

  public startListening() {
    if (!this.recognition) return;
    this.isListeningActive = true;
    try {
      this.recognition.start();
      this.currentState.isListening = true;
      this.notify();
    } catch (e) {
      // Already started
    }
  }

  public stopListening() {
    this.isListeningActive = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.currentState.isListening = false;
    this.notify();
  }

  private handleSpeechResult(event: any) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }

    transcript = transcript.trim().toLowerCase();
    if (!transcript) return;

    this.currentState.lastHeardPhrase = transcript;

    // Detect driver voice triggers
    if (
      transcript.includes('tell me more') ||
      transcript.includes('tell more') ||
      transcript.includes('more') ||
      transcript.includes('explore') ||
      transcript.includes('folklore') ||
      transcript.includes('story') ||
      transcript.includes('pull thread')
    ) {
      this.currentState.commandDetected = 'tell_me_more';
      this.notify();
      this.commandCallbacks.forEach(fn => fn('tell_me_more'));

      // Clear detected command after 3 seconds
      setTimeout(() => {
        this.currentState.commandDetected = null;
        this.notify();
      }, 3000);
    } else if (transcript.includes('stop') || transcript.includes('quiet') || transcript.includes('mute')) {
      this.currentState.commandDetected = 'stop_audio';
      this.notify();
      this.commandCallbacks.forEach(fn => fn('stop_audio'));
    } else {
      this.notify();
    }
  }

  public getState(): VoiceCommandState {
    return this.currentState;
  }
}

export const voiceCommandService = new VoiceCommandService();
