import { useEffect, useState } from 'react';
import { Mic, MicOff, Square, X } from 'lucide-react';
import type { EnrichedH3Cell } from '../types';
import { ThreadImageFigure, imageForTrack } from './ThreadImageFigure';

/** What is being spoken, for the focus screen. Pure: unit-tested. */
export function subjectForTrack(trackId: string | null, cell: EnrichedH3Cell, crossingName?: string | null): string | null {
  if (!trackId) return null;
  if (trackId.startsWith('thread-')) return cell.threads.find((t) => `thread-${t.id}` === trackId)?.title ?? null;
  if (trackId.startsWith('ambient-teaser-') || trackId.startsWith('cell-narrative-')) return cell.townland;
  if (trackId.startsWith('crossing-')) return crossingName ?? 'Crossing';
  return null;
}

/**
 * While anything is being narrated, the screen shows only what matters in the car: the picture
 * (if the item has one) and a big Tap-to-talk button. No text to read. Dismissable; returns on the next narration.
 */
export function NowSpeakingScreen(props: {
  trackId: string | null;
  playbackState: 'idle' | 'loading' | 'playing' | 'paused';
  cell: EnrichedH3Cell;
  crossingName?: string | null;
  isListening: boolean;
  onTapToTalk: () => void;
  onStop: () => void;
}) {
  const { trackId, playbackState, cell, crossingName, isListening, onTapToTalk, onStop } = props;
  const [dismissedTrack, setDismissedTrack] = useState<string | null>(null);
  const active = (playbackState === 'playing' || playbackState === 'paused' || playbackState === 'loading') && !!trackId;
  useEffect(() => {
    if (!active) setDismissedTrack(null);
  }, [active]);
  if (!active || dismissedTrack === trackId) return null;
  const subject = subjectForTrack(trackId, cell, crossingName);
  const shown = imageForTrack(trackId, cell.threads, cell.teaserImage);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur flex flex-col p-4 gap-4" role="dialog" aria-label="Now speaking">
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono uppercase tracking-wide text-amber-300 truncate">
          Now speaking{subject ? `: ${subject}` : ''}
        </div>
        <button type="button" onClick={() => setDismissedTrack(trackId)} className="p-2 rounded-xl text-slate-400 hover:text-white" aria-label="Hide">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        {shown ? (
          <div className="w-full max-h-full">
            <ThreadImageFigure key={shown.image.url} image={shown.image} size="hero" subject={shown.subject} />
          </div>
        ) : (
          <div className="text-center text-3xl sm:text-5xl font-bold text-white leading-tight px-4">{subject ?? cell.townland}</div>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <button
          type="button"
          onClick={onTapToTalk}
          className={`min-h-[96px] rounded-3xl border-2 text-xl font-bold flex items-center justify-center gap-3 active:scale-[0.99] ${
            isListening ? 'bg-emerald-600/30 border-emerald-400 text-emerald-100' : 'bg-slate-800 border-slate-600 text-white'
          }`}
        >
          {isListening ? <Mic className="w-7 h-7 animate-pulse" /> : <MicOff className="w-7 h-7" />}
          {isListening ? 'Listening… tap to cancel' : 'Tap to talk'}
        </button>
        <button
          type="button"
          onClick={onStop}
          className="min-h-[96px] px-6 rounded-3xl border-2 border-rose-500/50 bg-rose-500/10 text-rose-200 font-bold flex flex-col items-center justify-center gap-1"
          aria-label="Stop narration"
        >
          <Square className="w-6 h-6" />
          Stop
        </button>
      </div>
    </div>
  );
}
