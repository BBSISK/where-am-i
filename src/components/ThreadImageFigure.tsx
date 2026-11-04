import { useState } from 'react';
import type { ThreadImage } from '../types';

/**
 * Shows the one image an item may have, with its credit, licence note and a link to the record.
 * If the image fails to load, nothing is shown (never a placeholder that could be mistaken for the place).
 */
export function ThreadImageFigure({ image, compact = false }: { image: ThreadImage; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  if (compact) {
    return (
      <img
        src={image.url}
        alt={image.alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-16 h-16 rounded-lg object-cover border border-slate-800 shrink-0"
      />
    );
  }
  return (
    <figure className="space-y-1">
      <img
        src={image.url}
        alt={image.alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full max-h-64 rounded-xl object-cover border border-slate-800"
      />
      <figcaption className="text-[10px] text-slate-500 font-mono">
        {image.credit} ({image.licence}).{' '}
        <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">
          View the record
        </a>
      </figcaption>
    </figure>
  );
}
