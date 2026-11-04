import { describe, it, expect } from 'vitest';
import { imageForTrack } from './ThreadImageFigure';

const img = { url: 'https://www.buildingsofireland.ie/a.jpg', alt: 'a', credit: 'Photo: NIAH', licence: 'NIAH terms', sourceUrl: 'u', sourceId: 'niah-images' };
const threads = [{ id: 'smr-1', title: 'Castle' }, { id: 'niah-2', title: 'Carton House', image: img }];
const teaser = { image: img, subject: 'Carton House' };

describe('imageForTrack', () => {
  it('shows the speaking thread\'s own image, captioned with its title', () => {
    expect(imageForTrack('thread-niah-2', threads, teaser)).toEqual({ image: img, subject: 'Carton House' });
  });
  it('never borrows another thread\'s image', () => {
    expect(imageForTrack('thread-smr-1', threads, teaser)).toBeNull();
  });
  it('shows the teaser image only for the teaser track', () => {
    expect(imageForTrack('ambient-teaser-town:1', threads, teaser)).toBe(teaser);
    expect(imageForTrack('cell-narrative-88a', threads, teaser)).toBeNull();
    expect(imageForTrack(null, threads, teaser)).toBeNull();
  });
});
