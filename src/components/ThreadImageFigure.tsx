import { useState } from 'react';
import type { ThreadImage } from '../types';

type Size = 'thumb' | 'normal' | 'hero';

/**
 * Shows the one image an item may have, with its credit, licence note and a link to the record.
 * `subject` names what is pictured when the image illustrates something broader (e.g. a town teaser).
 * If the image fails to load, nothing is shown (never a placeholder that could be mistaken for the place).
 */
export function ThreadImageFigure({ image, size = 'normal', subject }: { image: ThreadImage; size?: Size; subject?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  const img = (cls: string) => (
    <img
      src={image.url}
      alt={image.alt}
      loading={size === 'thumb' ? 'lazy' : 'eager'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cls}
    />
  );
  if (size === 'thumb') return img('w-16 h-16 rounded-lg object-cover border border-slate-800 shrink-0');
  return (
    <figure className="space-y-1">
      {img(
        size === 'hero'
          ? 'w-full max-h-[60vh] rounded-2xl object-contain bg-slate-950 border border-slate-800'
          : 'w-full max-h-64 rounded-xl object-cover border border-slate-800'
      )}
      <figcaption className="text-[10px] text-slate-500 font-mono">
        {(image.depicts || subject) && <span className="text-slate-300">Pictured: {image.depicts || subject}. </span>}
        {image.credit} ({image.licence}).{' '}
        <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">
          View the record
        </a>
      </figcaption>
    </figure>
  );
}

/** The image to show for whatever is being spoken right now, if any. Pure: unit-tested. */
export function imageForTrack(
  trackId: string | null,
  threads: { id: string; title: string; image?: ThreadImage }[],
  teaserImage?: { image: ThreadImage; subject: string }
): { image: ThreadImage; subject: string } | null {
  if (!trackId) return null;
  if (trackId.startsWith('thread-')) {
    const t = threads.find((x) => `thread-${x.id}` === trackId);
    return t?.image ? { image: t.image, subject: t.title } : null;
  }
  if (trackId.startsWith('ambient-teaser-') && teaserImage) return teaserImage;
  return null;
}
