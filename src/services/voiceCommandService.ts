export type VoiceCommandType = 'tell_me_more' | 'where_am_i' | 'wake_word' | 'stop_audio';

export interface VoiceCommandState {
  isSupported: boolean;
  isListening: boolean;
  lastHeardPhrase: string;
  commandDetected: VoiceCommandType | null;
}

class VoiceCommandService {
  private recognition: any = null;
  private isListeningActive: boolean = false;
  private listeners: Set<(state: VoiceCommandState) => void> = new Set();
  private commandCallbacks: Set<(cmd: VoiceCommandType) => void> = new Set();

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

  public onCommand(callback: (cmd: VoiceCommandType) => void) {
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
      // Already running
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

  private triggerCommand(cmd: VoiceCommandType) {
    this.currentState.commandDetected = cmd;
    this.notify();
    this.commandCallbacks.forEach(fn => fn(cmd));

    // Clear after 3 seconds
    setTimeout(() => {
      if (this.currentState.commandDetected === cmd) {
        this.currentState.commandDetected = null;
        this.notify();
      }
    }, 3000);
  }

  private handleSpeechResult(event: any) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }

    transcript = transcript.trim().toLowerCase();
    if (!transcript) return;

    this.currentState.lastHeardPhrase = transcript;

    // 1. Wake word triggers ("Hey Anseo", "Anseo")
    if (
      transcript.includes('hey anseo') ||
      transcript.includes('anseo') ||
      transcript.includes('an seo') ||
      transcript.includes('hey antioch') || // Phonetic catch
      transcript.includes('hey an show')
    ) {
      this.triggerCommand('wake_word');
      return;
    }

    // 2. "Where Am I?" / Location Query
    if (
      transcript.includes('where am i') ||
      transcript.includes('where are we') ||
      transcript.includes('what is this place') ||
      transcript.includes('what townland') ||
      transcript.includes('location')
    ) {
      this.triggerCommand('where_am_i');
      return;
    }

    // 3. "Tell Me More" / Deep Thread Trigger
    if (
      transcript.includes('tell me more') ||
      transcript.includes('tell more') ||
      transcript.includes('more') ||
      transcript.includes('explore') ||
      transcript.includes('folklore') ||
      transcript.includes('story') ||
      transcript.includes('history') ||
      transcript.includes('pull thread')
    ) {
      this.triggerCommand('tell_me_more');
      return;
    }

    // 4. Mute / Silence Commands
    if (
      transcript.includes('stop') ||
      transcript.includes('quiet') ||
      transcript.includes('mute') ||
      transcript.includes('silence')
    ) {
      this.triggerCommand('stop_audio');
      return;
    }

    this.notify();
  }

  public getState(): VoiceCommandState {
    return this.currentState;
  }
}

export const voiceCommandService = new VoiceCommandService();
