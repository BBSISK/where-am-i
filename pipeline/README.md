# Data pipeline (offline)

Builds the app's place data from primary sources. Runs on a developer machine or in CI, never in the browser.

## Setup
```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r pipeline/requirements.txt
# put LOGAINM_API_KEY=... in the repo's .env (git-ignored)
```

## Steps
1. `python pipeline/fetch_logainm.py Kildare Dublin`: Logainm townlands and towns per county → `pipeline/cache/logainm/` (git-ignored raw cache, with pull date).
2. *(next)* fetch Tailte Éireann townland boundaries; map every H3 res-8 cell to an area (town if inside one, else townland).
3. `compose.py`: turns one Logainm record into teaser sentences, **each carrying the ids of the records it is built from**. Unvalidated Irish names are never spoken. No explanatory notes yet (not in the Logainm API).

## Tests
```bash
cd pipeline && python -m pytest -q
```

## Sources and licences
| Source | Licence | Attribution |
|---|---|---|
| Logainm API v1.0 (Gaois, DCU) | CC BY 4.0 | Irish-language placename data by Logainm © Government of Ireland and licensed under CC BY 4.0. |
| Tailte Éireann Townlands, National Statutory Boundaries 2019, Generalised 20m *(next step)* | CC BY 4.0 | © Tailte Éireann |
