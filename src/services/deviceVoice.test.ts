import { describe, it, expect } from 'vitest';
import { pickDeviceVoice, DeviceVoiceLike } from './audioNarrationService';

const v = (name: string, lang: string, localService = true): DeviceVoiceLike => ({ name, lang, voiceURI: name, localService });

describe('pickDeviceVoice (accent preference, never gender)', () => {
  it('prefers Irish English when available', () => {
    const voices = [v('English Australia', 'en-AU'), v('English United Kingdom', 'en-GB'), v('Moira', 'en-IE')];
    expect(pickDeviceVoice(voices)?.lang).toBe('en-IE');
  });

  it('falls back to British English (Android-style list, Australian listed first)', () => {
    const voices = [v('English Australia', 'en-AU'), v('English United States', 'en-US'), v('English United Kingdom', 'en_GB')];
    expect(pickDeviceVoice(voices)?.name).toBe('English United Kingdom');
  });

  it('honours a saved user choice', () => {
    const voices = [v('Moira', 'en-IE'), v('Karen', 'en-AU')];
    expect(pickDeviceVoice(voices, 'Karen')?.name).toBe('Karen');
  });

  it('ignores a saved choice that no longer exists', () => {
    const voices = [v('Daniel', 'en-GB')];
    expect(pickDeviceVoice(voices, 'Gone')?.name).toBe('Daniel');
  });

  it('prefers on-device over network voices for the same accent (works offline)', () => {
    const voices = [v('Google UK English', 'en-GB', false), v('Daniel', 'en-GB', true)];
    expect(pickDeviceVoice(voices)?.name).toBe('Daniel');
  });

  it('returns null when there are no voices', () => {
    expect(pickDeviceVoice([])).toBeNull();
  });
});
