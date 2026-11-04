export type VoiceCommandType = 'tell_me_more' | 'where_am_i' | 'wake_word' | 'stop_audio';

export interface VoiceCommandState {
  isSupported: boolean;
  isListening: boolean;
  lastHeardPhrase: string;
  commandDetected: VoiceCommandType | null;
}

/** How long one tap keeps the microphone open. */
export const TAP_TO_TALK_WINDOW_MS = 7000;

class VoiceCommandService {
  private recognition: any = null;
  private isListeningActive: boolean = false;
  private isAudioSpeaking: boolean = false;
  private restartTimeout: any = null;
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
          // Tap-to-talk: ONE short listening session per tap. Continuous listening with auto-restart
          // made Android grab audio focus every few seconds and interrupt the car radio (drive test 2026-11-03).
          rec.continuous = false;
          rec.interimResults = true;
          try {
            rec.lang = 'en-IE';
          } catch (e) {
            rec.lang = 'en-US';
          }

          rec.onstart = () => {
            this.currentState.isListening = true;
            this.notify();
          };

          rec.onresult = (event: any) => this.handleSpeechResult(event);

          rec.onend = () => {
            // Never auto-restart. The session is over until the user taps again.
            if (this.restartTimeout) clearTimeout(this.restartTimeout);
            this.restartTimeout = null;
            this.isListeningActive = false;
            this.currentState.isListening = false;
            this.notify();
          };

          rec.onerror = (err: any) => {
            if (err.error !== 'no-speech' && err.error !== 'aborted') {
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

  /** Listen once (tap-to-talk). Stops by itself after a short window or when speech ends. */
  public startListening() {
    if (!this.recognition || this.isAudioSpeaking) return;
    this.isListeningActive = true;
    try {
      this.recognition.start();
      this.currentState.isListening = true;
      this.notify();
    } catch (e) {
      // Already running
    }
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    this.restartTimeout = setTimeout(() => this.stopListening(), TAP_TO_TALK_WINDOW_MS);
  }

  public stopListening() {
    this.isListeningActive = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
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

  public setAudioSpeaking(speaking: boolean) {
    this.isAudioSpeaking = speaking;
    // If narration starts while the mic is open, close it. Never reopen automatically.
    if (speaking && this.currentState.isListening) {
      this.stopListening();
    }
  }

  /** Backward compatibility alias */
  public setAudioDucked(ducked: boolean) {
    this.setAudioSpeaking(ducked);
  }

  public toggleListening(): boolean {
    if (this.isListeningActive) {
      this.stopListening();
      return false;
    } else {
      this.startListening();
      return true;
    }
  }

  private handleSpeechResult(event: any) {
    // HARD GUARD: If audio is currently speaking, completely ignore microphone input
    // to prevent acoustic feedback loop where phone speakers trigger voice commands
    if (this.isAudioSpeaking) return;

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

    // 2. "Where Am I?" / Location Query (Requires explicit location intent)
    if (
      transcript.includes('where am i') ||
      transcript.includes('where are we') ||
      transcript.includes('what townland') ||
      transcript.includes('what is this place') ||
      transcript.includes('what place is this') ||
      transcript.includes('current location')
    ) {
      this.triggerCommand('where_am_i');
      return;
    }

    // 3. "Tell Me More" / Deep Thread Trigger (Requires intentional phrase - never single words like "more" or "history")
    if (
      transcript.includes('tell me more') ||
      transcript.includes('tell more') ||
      transcript.includes('tell me a story') ||
      transcript.includes('tell the story') ||
      transcript.includes('more details') ||
      transcript.includes('tell me folklore') ||
      transcript.includes('pull thread') ||
      transcript.includes('unfold thread') ||
      transcript.includes('unfold story')
    ) {
      this.triggerCommand('tell_me_more');
      return;
    }

    // 4. Mute / Silence Commands (Requires intentional command phrases - never single isolated word "stop")
    if (
      transcript.includes('stop audio') ||
      transcript.includes('stop talking') ||
      transcript.includes('pause audio') ||
      transcript.includes('be quiet') ||
      transcript.includes('silence audio') ||
      transcript.includes('shut up') ||
      (transcript.includes('stop') && transcript.includes('anseo'))
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
