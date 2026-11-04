import { describe, it, expect } from 'vitest';
import { subjectForTrack } from './NowSpeakingScreen';

const cell = { townland: 'Maynooth', threads: [{ id: 'niah-1', title: 'Carton House' }] } as any;

describe('subjectForTrack', () => {
  it('names what is being spoken', () => {
    expect(subjectForTrack('thread-niah-1', cell)).toBe('Carton House');
    expect(subjectForTrack('ambient-teaser-town:1', cell)).toBe('Maynooth');
    expect(subjectForTrack('crossing-wi-canal-royal-canal', cell, 'Royal Canal')).toBe('Royal Canal');
    expect(subjectForTrack(null, cell)).toBeNull();
  });
});
