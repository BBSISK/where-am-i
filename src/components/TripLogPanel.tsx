import React from 'react';

export interface TripLogEntry {
  time: string;
  area: string;
  kind: string;
  outcome: string;
}

/** Drive-test diagnostics: which area was entered and whether its teaser was spoken (and why not). */
export const TripLogPanel: React.FC<{ entries: TripLogEntry[]; onClear: () => void }> = ({ entries, onClear }) => {
  const asText = entries.map((e) => `${e.time}\t${e.kind}\t${e.area}\t${e.outcome}`).join('\n');
  return (
    <details className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
      <summary className="cursor-pointer font-mono text-slate-400">Trip log ({entries.length}): for drive tests</summary>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(asText)}
          className="rounded-lg bg-slate-800 px-2 py-1 font-mono hover:bg-slate-700"
        >
          Copy
        </button>
        <button type="button" onClick={onClear} className="rounded-lg bg-slate-800 px-2 py-1 font-mono hover:bg-slate-700">
          Clear
        </button>
      </div>
      <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto font-mono">
        {[...entries].reverse().map((e, i) => (
          <li key={i}>
            <span className="text-slate-500">{e.time}</span> <span className="text-amber-400">[{e.kind}]</span> {e.area}{' '}
            <span className={e.outcome.startsWith('spoken') ? 'text-emerald-400' : 'text-slate-500'}>{e.outcome}</span>
          </li>
        ))}
      </ul>
    </details>
  );
};
