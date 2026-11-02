import { EnrichedH3Cell, GeoCoordinate, SourceRef } from '../types';

/**
 * Verified-only cell resolver (rebuild, 2026-11).
 *
 * All previous curated/generated heritage content was removed because it could not be traced to
 * primary sources. Until the data pipeline supplies verified records, a cell carries ONLY:
 *   - its H3 index and coordinates, and
 *   - a place name from OpenStreetMap (Nominatim), cited, or a plain waypoint name.
 * Nothing else is displayed or spoken.
 */

export const OSM_SOURCE: SourceRef = {
  id: 'osm-nominatim',
  name: 'OpenStreetMap (Nominatim reverse geocoding)',
  url: 'https://www.openstreetmap.org/copyright',
  licence: 'ODbL 1.0',
  attribution: '© OpenStreetMap contributors'
};

export function honestTeaser(placeName: string | null): string {
  return placeName
    ? `You're near ${placeName}. Verified place-name history for this area isn't available yet.`
    : `Location found. Verified place-name history for this area isn't available yet.`;
}

/** Builds a cell that claims nothing beyond a place name and its source. */
export function buildVerifiedCell(
  h3Index: string,
  center: GeoCoordinate,
  placeName: string | null,
  county: string | null,
  sources: SourceRef[],
  areaId?: string
): EnrichedH3Cell {
  return {
    h3Index,
    center,
    areaId,
    townland: placeName ?? 'Unnamed area',
    parish: '',
    county: county ?? '',
    monuments: [],
    teaserScript: honestTeaser(placeName),
    narrativeScript: honestTeaser(placeName),
    threads: [],
    keyHighlights: [],
    sources,
    curatedByAgent: false,
    enrichmentLatencyMs: 0,
    tokensConsumed: 0
  };
}

// --- Nominatim reverse geocoding (usage policy: max 1 request/second, cache results) ---
const cache = new Map<string, EnrichedH3Cell>();
let lastRequestAt = 0;

async function reverseGeocode(coord: GeoCoordinate): Promise<{ name: string | null; county: string | null }> {
  const wait = Math.max(0, lastRequestAt + 1100 - Date.now());
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastRequestAt = Date.now();
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coord.lat}&lon=${coord.lng}&zoom=14&addressdetails=1`,
      { signal: controller.signal, headers: { 'Accept-Language': 'en' } }
    );
    clearTimeout(t);
    if (!res.ok) return { name: null, county: null };
    const data = await res.json();
    const a = data.address || {};
    const name = a.village || a.town || a.suburb || a.hamlet || a.city_district || a.city || null;
    const county = a.county ? String(a.county).replace(/^County\s+/i, '') : null;
    return { name, county };
  } catch {
    return { name: null, county: null };
  }
}

export async function resolveCell(h3Index: string, coord: GeoCoordinate): Promise<EnrichedH3Cell> {
  const hit = cache.get(h3Index);
  if (hit) return hit;
  const { name, county } = await reverseGeocode(coord);
  // Interim area model: the OSM place name (+county) stands in for the area until the townland/settlement pipeline exists.
  const areaId = name ? `osm:${name}|${county ?? ''}` : undefined;
  const cell = buildVerifiedCell(h3Index, coord, name, county, name ? [OSM_SOURCE] : [], areaId);
  cache.set(h3Index, cell);
  return cell;
}

/** For simulated-route waypoints: uses the plain waypoint name, claims nothing else. */
export function cellFromWaypoint(name: string, h3Index: string, coord: GeoCoordinate): EnrichedH3Cell {
  return buildVerifiedCell(h3Index, coord, name, null, [], `sim:${name}`);
}
