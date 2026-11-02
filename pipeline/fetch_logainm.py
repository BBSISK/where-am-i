"""
Fetch Logainm (Placenames Database of Ireland) records for given counties.

Licence: CC BY 4.0. Attribution: "Irish-language placename data by Logainm (c) Government of Ireland
and licensed under CC BY 4.0."  https://docs.gaois.ie/en/data/logainm/v1.0/licence

Requires LOGAINM_API_KEY in the environment (put it in the repo's git-ignored .env).
Raw API responses are cached under pipeline/cache/logainm/ (git-ignored) so re-runs are cheap.

Usage:  python pipeline/fetch_logainm.py Kildare Dublin
"""
import json, os, sys, time
from pathlib import Path
import requests

BASE = "https://www.logainm.ie/api/v1.0"
ROOT = Path(__file__).resolve().parent
CACHE = ROOT / "cache" / "logainm"
CATEGORIES = {"BF": "townland", "B": "town"}


def load_env():
    env = ROOT.parent / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())
    key = os.environ.get("LOGAINM_API_KEY")
    if not key:
        sys.exit("LOGAINM_API_KEY not set (add it to .env)")
    return {"X-Api-Key": key}


def get(headers, url, params=None):
    for attempt in range(4):
        r = requests.get(url, headers=headers, params=params, timeout=60)
        if r.status_code == 200:
            return r.json()
        if r.status_code in (429, 500, 502, 503):
            time.sleep(2 ** attempt)
            continue
        r.raise_for_status()
    r.raise_for_status()


def county_ids(headers):
    out = {}
    for c in get(headers, f"{BASE}/counties")["results"]:
        for p in c["placenames"]:
            if p["language"] == "en":
                out[p["wording"]] = c["id"]
    return out


def fetch(headers, county_id, category):
    """All places of one category within one county (paged)."""
    page, rows = 1, []
    while True:
        d = get(headers, BASE, {"PlaceID": county_id, "CategoryID": category, "PerPage": 100, "Page": page})
        rows.extend(d["results"])
        if page >= (d.get("totalPages") or 1):
            return rows, d.get("totalCount")
        page += 1
        time.sleep(0.3)  # be polite


def main(counties):
    headers = load_env()
    ids = county_ids(headers)
    CACHE.mkdir(parents=True, exist_ok=True)
    for name in counties:
        if name not in ids:
            sys.exit(f"Unknown county {name!r}; known: {sorted(ids)}")
        for cat in CATEGORIES:
            rows, total = fetch(headers, ids[name], cat)
            if total is not None and len(rows) != total:
                sys.exit(f"{name}/{cat}: got {len(rows)} of {total}, refusing to write a partial file")
            out = CACHE / f"{name.lower()}_{CATEGORIES[cat]}s.json"
            out.write_text(json.dumps({
                "source": "Logainm API v1.0", "url": BASE, "licence": "CC BY 4.0",
                "county": name, "countyId": ids[name], "category": cat,
                "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "count": len(rows), "results": rows,
            }, ensure_ascii=False))
            print(f"{name}: {len(rows)} {CATEGORIES[cat]}s -> {out.relative_to(ROOT.parent)}")


if __name__ == "__main__":
    main(sys.argv[1:] or ["Kildare", "Dublin"])
