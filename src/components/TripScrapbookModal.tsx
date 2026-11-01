import React from 'react';
import { X, Bookmark, Volume2, Trash2, Share2, MapPin } from 'lucide-react';
import { SavedTripThread } from '../types';
import { audioService } from '../services/audioNarrationService';

interface TripScrapbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedThreads: SavedTripThread[];
  onClearScrapbook: () => void;
}

export const TripScrapbookModal: React.FC<TripScrapbookModalProps> = ({
  isOpen,
  onClose,
  savedThreads,
  onClearScrapbook
}) => {
  if (!isOpen) return null;

  const handleReplayThread = (narrative: string) => {
    audioService.speak(narrative);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Your Trip Scrapbook & Heritage Pass</h3>
              <p className="text-xs text-slate-400 font-mono">
                {savedThreads.length} Pulled Threads collected during this drive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {savedThreads.length === 0 ? (
            <div className="p-8 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No Threads Pulled Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                As you drive through Ireland, tap any <span className="text-emerald-400 font-semibold">"Pull on a Thread"</span> button when an audio teaser catches your ear. They will be archived here for replay and sharing.
              </p>
            </div>
          ) : (
            savedThreads.map((thread) => (
              <div
                key={thread.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {thread.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {thread.townland}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{thread.timestamp}</span>
                </div>

                <h4 className="text-sm font-bold text-white">{thread.threadTitle}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                  "{thread.spokenNarrative}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] font-mono text-slate-500">H3 Cell: #{thread.h3Index}</span>
                  <button
                    onClick={() => handleReplayThread(thread.spokenNarrative)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-mono transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Audio</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {savedThreads.length > 0 && (
            <button
              onClick={onClearScrapbook}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-500 hover:text-rose-400 text-xs font-mono transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Scrapbook</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all"
            >
              Close
            </button>
            <button
              onClick={async () => {
                const summary = [
                  `🚗 Where Am I? (Cá bhfuil mé?) — Irish Road Trip Scrapbook`,
                  `Total Discoveries: ${savedThreads.length}\n`,
                  ...savedThreads.map(
                    (t, i) =>
                      `[${i + 1}] 📍 ${t.townland} (${t.category.toUpperCase()})\n` +
                      `✨ ${t.threadTitle}\n` +
                      `"${t.spokenNarrative}"\n`
                  ),
                  `— Captured live on the N4 Corridor with Where Am I?`
                ].join('\n');

                if (typeof navigator !== 'undefined' && navigator.share) {
                  try {
                    await navigator.share({
                      title: 'My Irish Road Trip Scrapbook',
                      text: summary
                    });
                    return;
                  } catch (e) {
                    // Fall through to clipboard
                  }
                }
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  await navigator.clipboard.writeText(summary);
                  alert('Trip Scrapbook copied to clipboard!');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Trip Summary</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
