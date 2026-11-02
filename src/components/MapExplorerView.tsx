import React, { useState } from 'react';
import { Layers, MapPin } from 'lucide-react';
import { EnrichedH3Cell, SimulatedRoute } from '../types';

interface MapExplorerViewProps {
  currentRoute: SimulatedRoute;
  currentWaypointIndex: number;
  currentCell: EnrichedH3Cell;
  onSelectWaypoint: (index: number) => void;
}

export const MapExplorerView: React.FC<MapExplorerViewProps> = ({
  currentRoute,
  currentWaypointIndex,
  currentCell,
  onSelectWaypoint
}) => {
  const [showHexGrid, setShowHexGrid] = useState(true);
  const [showMonuments, setShowMonuments] = useState(true);

  // SVG coordinate transformation for Ireland
  // Ireland bounding box: Lat 51.4 to 55.4, Lng -10.6 to -5.8
  const minLat = 51.4;
  const maxLat = 55.4;
  const minLng = -10.6;
  const maxLng = -5.8;

  const projectToSvg = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    const y = 600 - ((lat - minLat) / (maxLat - minLat)) * 550;
    return { x, y };
  };

  const activeWaypoint = currentRoute.waypoints[currentWaypointIndex];
  const activeCoord = projectToSvg(activeWaypoint.coordinate.lat, activeWaypoint.coordinate.lng);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white">Spatial Grid & Corridor Explorer</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Uber H3 Res-8 Hexagonal Partitioning (~0.74 km² per cell) across Ireland
          </p>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHexGrid(!showHexGrid)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
              showHexGrid
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>H3 Hex Grid</span>
          </button>

          <button
            onClick={() => setShowMonuments(!showMonuments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
              showMonuments
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Monuments</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Map Canvas */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden relative">
          
          <div className="absolute top-6 left-6 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs font-mono space-y-1 shadow-lg">
            <div className="text-emerald-400 font-bold">Active H3 Cell: #{currentCell.h3Index}</div>
            <div className="text-slate-400">Townland: {currentCell.townland} ({currentCell.county})</div>
            <div className="text-slate-500">Center: {activeWaypoint.coordinate.lat.toFixed(4)}°N, {Math.abs(activeWaypoint.coordinate.lng).toFixed(4)}°W</div>
          </div>

          <svg
            viewBox="0 0 800 650"
            className="w-full h-auto bg-slate-950/80 rounded-xl border border-slate-900 shadow-inner"
            style={{ maxHeight: '600px' }}
          >
            <defs>
              <pattern id="hex-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M12 0 L24 7 L24 21 L12 28 L0 21 L0 7 Z" fill="none" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="0.5" />
              </pattern>
              <radialGradient id="emerald-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ireland Background Coastline Outline (Schematic Path) */}
            <path
              d="M 450 70 
                 Q 500 100, 520 180 
                 T 530 260 
                 Q 540 330, 500 400 
                 T 460 480 
                 Q 380 540, 280 520 
                 T 160 520 
                 Q 100 480, 110 400 
                 T 140 330 
                 Q 130 240, 220 160 
                 T 320 110 
                 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.5"
            />

            {/* Hex Grid Overlay */}
            {showHexGrid && (
              <rect x="50" y="50" width="700" height="550" fill="url(#hex-pattern)" />
            )}

            {/* Route Line Connecting Waypoints */}
            <polyline
              points={currentRoute.waypoints.map(w => {
                const p = projectToSvg(w.coordinate.lat, w.coordinate.lng);
                return `${p.x},${p.y}`;
              }).join(' ')}
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />

            {/* Waypoint Nodes along the route */}
            {currentRoute.waypoints.map((w, idx) => {
              const pt = projectToSvg(w.coordinate.lat, w.coordinate.lng);
              const isActive = idx === currentWaypointIndex;

              return (
                <g key={idx} onClick={() => onSelectWaypoint(idx)} className="cursor-pointer group">
                  {/* Hexagon approximation for each waypoint */}
                  {showHexGrid && (
                    <polygon
                      points={`${pt.x},${pt.y - 18} ${pt.x + 15.5},${pt.y - 9} ${pt.x + 15.5},${pt.y + 9} ${pt.x},${pt.y + 18} ${pt.x - 15.5},${pt.y + 9} ${pt.x - 15.5},${pt.y - 9}`}
                      fill={isActive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(51, 65, 85, 0.25)'}
                      stroke={isActive ? '#10b981' : '#475569'}
                      strokeWidth={isActive ? 2 : 1}
                      className="transition-all"
                    />
                  )}

                  {/* Waypoint circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? 7 : 4}
                    fill={isActive ? '#34d399' : '#94a3b8'}
                    stroke="#020617"
                    strokeWidth="2"
                  />

                  {/* Label */}
                  <text
                    x={pt.x + 12}
                    y={pt.y + 4}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isActive ? 'bold' : 'normal'}
                    fill={isActive ? '#a7f3d0' : '#64748b'}
                    className="select-none group-hover:fill-white"
                  >
                    {w.name.split(' (')[0]}
                  </text>
                </g>
              );
            })}

            {/* Current Active Vehicle Marker */}
            <g transform={`translate(${activeCoord.x}, ${activeCoord.y})`}>
              <circle cx="0" cy="0" r="22" fill="url(#emerald-glow)" className="animate-pulse" />
              <circle cx="0" cy="0" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            </g>

            {/* Monument Pins when toggled */}
            {showMonuments && currentCell.monuments.map((m, mIdx) => {
              const offsetX = (mIdx === 0 ? 15 : -15);
              const offsetY = (mIdx === 0 ? -15 : 15);
              return (
                <g key={m.id} transform={`translate(${activeCoord.x + offsetX}, ${activeCoord.y + offsetY})`}>
                  <circle cx="0" cy="0" r="4" fill="#f59e0b" stroke="#020617" strokeWidth="1.5" />
                  <text x="6" y="3" fontSize="9" fontFamily="monospace" fill="#fcd34d">
                    {m.name.split(' (')[0]}
                  </text>
                </g>
              );
            })}

          </svg>
        </div>

        {/* Selected Cell Inspector Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">Active Cell Inspection</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Res 8 Hex
              </span>
            </div>

            {currentCell.etymology ? (
              <>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase">Irish Placename</span>
              <h3 className="text-xl font-black text-white">{currentCell.etymology.irishName}</h3>
              {currentCell.etymology.phonetic && (
                <p className="text-xs text-amber-400 font-mono mt-0.5">{currentCell.etymology.phonetic}</p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs font-mono text-slate-400">Meaning & Roots:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentCell.etymology.explanation}
              </p>
            </div>

              </>
            ) : (
              <p className="text-xs text-slate-400">No verified place-name information for this area yet.</p>
            )}

            <div>
              <span className="text-xs font-mono text-slate-500 uppercase">Archaeological SMR Sites ({currentCell.monuments.length})</span>
              <div className="mt-2 space-y-2">
                {currentCell.monuments.map(m => (
                  <div key={m.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-400 font-mono">
                      <span className="text-emerald-400 font-bold">{m.name}</span>
                      <span>{m.era}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-1">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-center">
              <p className="text-[11px] font-mono text-slate-500">
                Click any milestone on the map to inspect its H3 spatial cell.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
