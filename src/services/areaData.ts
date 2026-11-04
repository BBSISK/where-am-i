import { EnrichedH3Cell, GeoCoordinate, SourceRef } from '../types';

/**
 * Verified area data built offline by pipeline/build_areas.py (Logainm + Tailte Éireann, CC BY 4.0).
 * Every sentence carries the ids of the records it was built from.
 */
export interface AreaSentence { text: string; sourceIds: string[] }
export interface AreaRecord {
  id: string;
  kind: 'town' | 'townland';
  name: string;
  nameGa: string | null;
  logainmId: number | null;
  logainmUrl: string | null;
  glossary?: { id: number; headword: string; translation: string }[];
  teaser: string;
  sentences: AreaSentence[];
  sources: string[];
  /** Townland mostly inside a CSO urban area (built-up). */
  builtUp?: boolean;
}
export interface SourceRegistryEntry { name: string; url: string; licence: string; attribution: string }
export interface AreaFile {
  county: string;
  h3Resolution: number;
  sources: Record<string, SourceRegistryEntry>;
  areas: Record<string, AreaRecord>;
  cells: Record<string, string>;
}

const cellIndex = new Map<string, { area: AreaRecord; registry: Record<string, SourceRegistryEntry> }>();
let loading: Promise<void> | null = null;

export function indexAreaFile(doc: AreaFile): void {
  for (const [cell, areaId] of Object.entries(doc.cells)) {
    const area = doc.areas[areaId];
    if (area) cellIndex.set(cell, { area, registry: doc.sources });
  }
}

/** Loads all county files listed in /data/areas/index.json (once). Failures leave the index empty. */
export function loadAreaData(base = '/data/areas'): Promise<void> {
  if (!loading) {
    loading = (async () => {
      try {
        const idx = await (await fetch(`${base}/index.json`)).json();
        const docs = await Promise.all(
          (idx.counties as string[]).map(async (c) => (await fetch(`${base}/${c}.json`)).json() as Promise<AreaFile>)
        );
        docs.forEach(indexAreaFile);
      } catch (e) {
        console.warn('Area data unavailable; falling back to place names only.', e);
      }
    })();
  }
  return loading;
}

export function lookupArea(h3Index: string) {
  return cellIndex.get(h3Index) ?? null;
}

/** Builds a cell from a verified area record. Claims nothing the record doesn't contain. */
export function cellFromArea(
  area: AreaRecord,
  registry: Record<string, SourceRegistryEntry>,
  h3Index: string,
  center: GeoCoordinate
): EnrichedH3Cell {
  const sources: SourceRef[] = area.sources
    .filter((k) => registry[k])
    .map((k) => ({
      id: k,
      name: registry[k].name,
      url: k === 'logainm' && area.logainmUrl ? area.logainmUrl : registry[k].url,
      licence: registry[k].licence,
      attribution: registry[k].attribution
    }));
  return {
    h3Index,
    center,
    areaId: area.id,
    areaKind: area.kind,
    inBuiltUpArea: area.kind === 'townland' ? !!area.builtUp : false,
    townland: area.name,
    parish: '',
    county: '',
    etymology: area.nameGa
      ? {
          irishName: area.nameGa,
          englishName: area.name,
          phonetic: '',
          rootWords: (area.glossary ?? []).map((g) => ({ root: g.headword, meaning: g.translation })),
          explanation: area.teaser,
          source: 'Logainm (CC BY 4.0)'
        }
      : undefined,
    monuments: [],
    teaserScript: area.teaser,
    narrativeScript: area.teaser,
    threads: [],
    keyHighlights: [],
    sources,
    curatedByAgent: false,
    enrichmentLatencyMs: 0,
    tokensConsumed: 0
  };
}

/** Test helper. */
export function _resetAreaIndex(): void {
  cellIndex.clear();
  loading = null;
}
