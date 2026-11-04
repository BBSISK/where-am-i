import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

class FakeRecognition {
  static instances: FakeRecognition[] = [];
  continuous = true;
  interimResults = false;
  lang = '';
  starts = 0;
  onstart: any; onend: any; onresult: any; onerror: any;
  constructor() { FakeRecognition.instances.push(this); }
  start() { this.starts++; this.onstart?.(); }
  stop() { this.onend?.(); }
}

describe('voiceCommandService (tap-to-talk; drive test 2026-11-03)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    FakeRecognition.instances = [];
    (globalThis as any).window = { webkitSpeechRecognition: FakeRecognition };
  });
  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as any).window;
  });

  it('is not continuous', async () => {
    await import('./voiceCommandService');
    expect(FakeRecognition.instances[0].continuous).toBe(false);
  });

  it('never restarts by itself when a listening session ends', async () => {
    const { voiceCommandService } = await import('./voiceCommandService');
    const rec = FakeRecognition.instances[0];
    voiceCommandService.startListening();
    expect(rec.starts).toBe(1);
    rec.onend(); // browser ends the session (silence)
    vi.advanceTimersByTime(60_000);
    expect(rec.starts).toBe(1);
    expect(voiceCommandService.getState().isListening).toBe(false);
  });

  it('closes the mic after the tap-to-talk window', async () => {
    const { voiceCommandService, TAP_TO_TALK_WINDOW_MS } = await import('./voiceCommandService');
    voiceCommandService.startListening();
    vi.advanceTimersByTime(TAP_TO_TALK_WINDOW_MS + 10);
    expect(voiceCommandService.getState().isListening).toBe(false);
  });

  it('does not reopen the mic after narration finishes', async () => {
    const { voiceCommandService } = await import('./voiceCommandService');
    const rec = FakeRecognition.instances[0];
    voiceCommandService.startListening();
    voiceCommandService.setAudioSpeaking(true);
    voiceCommandService.setAudioSpeaking(false);
    vi.advanceTimersByTime(60_000);
    expect(rec.starts).toBe(1);
  });
});
