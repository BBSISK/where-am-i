"""
Fetch only what is needed. Each source is downloaded when its cached copy is missing or when it is named
in --refresh ("all" refreshes everything). Cached copies keep their own pull date, so provenance survives.

  python pipeline/fetch_all.py --counties "Kildare Dublin" --refresh none      # build from cache (seconds)
  python pipeline/fetch_all.py --counties "Kildare Dublin" --refresh dib rps   # refresh two sources
  python pipeline/fetch_all.py --counties "Kildare Dublin" --refresh all       # weekly full refresh

The Logainm fetch needs LOGAINM_API_KEY in the environment (repository secret); it is only called when needed.
"""
import argparse, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
C = HERE / "cache"


def sources(counties):
    lo = [c.lower() for c in counties]
    up = [c.upper() for c in counties]
    return {
        # name: (command, files that must exist for the cache to count as present)
        "logainm": (["fetch_logainm.py", *counties],
                    [C / "logainm" / f"{c}_{k}s.json" for c in lo for k in ("townland", "town")]),
        "boundaries": (["fetch_boundaries.py", *up],
                       [C / "boundaries" / f"{c}_{k}.geojson" for c in lo for k in ("townlands", "urban_areas")]),
        "heritage": (["fetch_heritage.py", *up], [C / "heritage" / f"{c}_{k}.json" for c in lo for k in ("smr", "niah", "mtv")]),
        "npws": (["fetch_npws.py", *lo], [C / "features" / f"{c}_npws.geojson" for c in lo]),
        "waterways": (["fetch_waterways.py", *lo], [C / "features" / f"{c}_{k}.geojson" for c in lo for k in ("rivers", "canals")]),
        "rps": (["fetch_rps.py"], [C / "heritage" / f"{c}_rps.json" for c in ("kildare", "dublin")]),
        "gsi": (["fetch_gsi.py", *lo], [C / "heritage" / f"{c}_gsi.json" for c in lo]),
        "commons": (["fetch_commons.py", *lo], [C / "heritage" / f"{c}_commons.json" for c in lo]),
        "dib": (["fetch_dib.py"], [C / "heritage" / "dib.json"]),
        "census": (["fetch_census.py"], [C / "census" / "towns_2022.json"]),
    }
# Order matters: boundaries before the sources that use the county bbox.
ORDER = ["logainm", "boundaries", "heritage", "npws", "waterways", "rps", "gsi", "commons", "dib", "census"]


def plan(counties, refresh, exists=lambda p: p.exists()):
    """Pure: which sources to fetch, and why."""
    srcs = sources(counties)
    todo = []
    for name in ORDER:
        _, files = srcs[name]
        if "all" in refresh or name in refresh:
            todo.append((name, "refresh requested"))
        elif not all(exists(f) for f in files):
            todo.append((name, "not in cache"))
    return todo


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--counties", default="Kildare Dublin")
    ap.add_argument("--refresh", nargs="*", default=["none"])
    a = ap.parse_args()
    counties = a.counties.split()
    refresh = {r.strip().lower() for r in a.refresh for r in r.split(",") if r.strip()}
    unknown = refresh - set(ORDER) - {"all", "none"}
    if unknown:
        sys.exit(f"unknown source(s) to refresh: {sorted(unknown)}; choose from {ORDER} or all/none")
    todo = plan(counties, refresh)
    srcs = sources(counties)
    if not todo:
        print("All sources already cached; nothing to fetch.")
    for name, why in todo:
        print(f"== {name}: {why}", flush=True)
        cmd, _ = srcs[name]
        subprocess.run([sys.executable, str(HERE / cmd[0]), *cmd[1:]], check=True)
    cached = [n for n in ORDER if n not in {t[0] for t in todo}]
    if cached:
        print(f"Used cached copies for: {', '.join(cached)}")


if __name__ == "__main__":
    main()
