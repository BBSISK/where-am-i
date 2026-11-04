# Data pipeline (offline)

Builds the app's place data from primary sources. Runs on a developer machine or in CI, never in the browser.

## Setup
```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r pipeline/requirements.txt
# put LOGAINM_API_KEY=... in the repo's .env (git-ignored)
```

## Steps (run by the "Build area data" GitHub workflow)
1. `fetch_logainm.py Kildare Dublin`: Logainm townlands and towns per county (needs `LOGAINM_API_KEY`).
2. `fetch_boundaries.py`: Tailte Éireann townlands and CSO/Tailte urban areas.
3. `fetch_heritage.py KILDARE DUBLIN`: NMS SMR, NIAH buildings, and NMS Monuments to Visit records.
4. `fetch_npws.py`, `fetch_waterways.py`: NPWS protected areas, EPA rivers, Waterways Ireland canals (crossings).
5. `fetch_rps.py`, `fetch_gsi.py`: Records of Protected Structures (Kildare, South Dublin) and GSI County Geological Sites.
6. `fetch_commons.py`, `fetch_dib.py`: Wikidata ID links to Commons photos (by SMR/NIAH number) and to DIB entries (by place of birth).
7. `fetch_census.py`: CSO Census 2022 town populations.
8. `build_areas.py`: maps every H3 res-8 cell to one area (town, else townland), composes sourced teasers (`compose.py`) and "Tell me more" threads (`heritage.py`), writes `public/data/areas/{county}.json`.

Hand-reviewed inputs live in `pipeline/review/` (e.g. `rivers.json`: which EPA river names may be spoken).

Rules: every sentence carries the ids of its source records; unvalidated Irish names are never spoken; heritage text is the record's own wording (mechanical edits only); when sources disagree each is spoken separately with its own attribution; at most one image per item, from an exact record join, credited. Non-commercial-only sources sit behind `NON_COMMERCIAL_SOURCES` in `build_areas.py` (see SOURCES.md decision log).

## Tests
```bash
cd pipeline && python -m pytest -q
```

## Sources and licences
| Source | Licence | Attribution |
|---|---|---|
| Logainm API v1.0 (Gaois, DCU) | CC BY 4.0 | Irish-language placename data by Logainm © Government of Ireland and licensed under CC BY 4.0. |
| Tailte Éireann Townlands, National Statutory Boundaries 2019, Generalised 20m *(next step)* | CC BY 4.0 | © Tailte Éireann |
