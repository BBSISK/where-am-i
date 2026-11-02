"""
Build the app's area data: every H3 res-8 cell -> one area, every area -> sourced teaser sentences.

Area rule (hybrid, agreed with Barry):
  * If the cell centre lies in a CSO Urban Area that is matched to a Logainm TOWN record
    (same name, and the Logainm town point lies inside the urban-area polygon), the area is that town.
  * Otherwise the area is the townland whose polygon contains the cell centre.
  Large urban areas with no matching Logainm town (e.g. "Dublin city and suburbs") are NOT areas;
  their cells fall back to townlands (e.g. Lucan -> "Lucan and Pettycanon").

Inputs (from fetch_logainm.py / fetch_boundaries.py, in pipeline/cache/), output: public/data/areas/<county>.json
Usage:  python pipeline/build_areas.py kildare dublin
"""
import json, re, sys, time, unicodedata
from pathlib import Path
import h3
from shapely.geometry import shape, Point
from compose import compose, english_name, validated_irish

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / "cache"
OUT = ROOT.parent / "public" / "data" / "areas"
RES = 8

SOURCES = {
    "logainm": {"name": "Logainm, Placenames Database of Ireland (Gaois, DCU)", "url": "https://www.logainm.ie",
                "licence": "CC BY 4.0",
                "attribution": "Irish-language placename data by Logainm © Government of Ireland and licensed under CC BY 4.0."},
    "tailte-townlands": {"name": "Tailte Éireann, Townlands NSB 2019 (generalised 20m)",
                         "url": "https://www.arcgis.com/home/item.html?id=1dc58c98ab004234ad0445e79a0f9af7",
                         "licence": "CC BY 4.0", "attribution": "© Tailte Éireann"},
    "tailte-urban": {"name": "Tailte Éireann / CSO, Urban Areas 2022 (generalised 20m)",
                     "url": "https://www.arcgis.com/home/item.html?id=5468708d36454d1f95a3ff23cbaeb2f5",
                     "licence": "CC BY 4.0", "attribution": "© Tailte Éireann"},
}


def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z]", "", s)


def load_logainm():
    recs = {}
    for f in (CACHE / "logainm").glob("*.json"):
        for r in json.loads(f.read_text())["results"]:
            recs[r["id"]] = r
    return recs


def towns_by_name(recs):
    out = {}
    for r in recs.values():
        if any(c["id"] == "B" for c in r.get("categories", [])):
            for n in r["placenames"]:
                if n["language"] == "en":
                    out.setdefault(norm(n["wording"]), []).append(r)
    return out


def logainm_point(r):
    cs = (r.get("geography") or {}).get("coordinates") or []
    return Point(cs[0]["longitude"], cs[0]["latitude"]) if cs else None


def cells_for(geom):
    return h3.geo_to_cells(geom.__geo_interface__, RES)


def area_from_logainm(r, kind, extra_sources):
    sents = compose(r)
    return {
        "id": f"{kind}:logainm:{r['id']}", "kind": kind,
        "name": english_name(r) or validated_irish(r), "nameGa": validated_irish(r),
        "logainmId": r["id"], "logainmUrl": r.get("permalink"),
        "glossary": [{"id": g["id"], "headword": g["headword"], "translation": g["translation"]}
                     for g in (r.get("glossary") or [])] if validated_irish(r) else [],
        "teaser": " ".join(s.text for s in sents),
        "sentences": [{"text": s.text, "sourceIds": s.source_ids} for s in sents],
        "sources": ["logainm"] + extra_sources,
    }


def build(county):
    recs = load_logainm()
    towns = towns_by_name(recs)
    tl = json.loads((CACHE / "boundaries" / f"{county}_townlands.geojson").read_text())["features"]
    ua = json.loads((CACHE / "boundaries" / f"{county}_urban_areas.geojson").read_text())["features"]

    areas, cell_area, report = {}, {}, {"townlandsWithoutLogainm": [], "urbanAreasUnmatched": []}

    # 1. townlands
    for f in tl:
        p = f["properties"]
        geom = shape(f["geometry"])
        lid = int(p["LOGAINM_ID"]) if p.get("LOGAINM_ID") and str(p["LOGAINM_ID"]).isdigit() else None
        r = recs.get(lid) if lid else None
        if r:
            a = area_from_logainm(r, "townland", ["tailte-townlands"])
        else:
            name = (p.get("ENGLISH") or "").title()
            report["townlandsWithoutLogainm"].append({"TD_ID": p["TD_ID"], "name": name, "LOGAINM_ID": p.get("LOGAINM_ID")})
            text = f"{name}, a townland."
            a = {"id": f"townland:td:{p['TD_ID']}", "kind": "townland", "name": name, "nameGa": None,
                 "logainmId": None, "logainmUrl": None, "teaser": text,
                 "sentences": [{"text": text, "sourceIds": [f"tailte-townland:{p['TD_ID']}"]}],
                 "sources": ["tailte-townlands"]}
        areas[a["id"]] = a
        for c in cells_for(geom):
            cell_area[c] = a["id"]

    # 2. towns override townlands (only urban areas matched to a Logainm town)
    for f in ua:
        p = f["properties"]
        geom = shape(f["geometry"])
        cands = [r for r in towns.get(norm(p["URBAN_AREA_NAME"]), []) if (pt := logainm_point(r)) and geom.contains(pt)]
        if len(cands) != 1:
            report["urbanAreasUnmatched"].append({"name": p["URBAN_AREA_NAME"], "code": p["URBAN_AREA_CODE"], "candidates": len(cands)})
            continue
        a = area_from_logainm(cands[0], "town", ["tailte-urban"])
        a["urbanAreaCode"] = p["URBAN_AREA_CODE"]
        areas[a["id"]] = a
        for c in cells_for(geom):
            cell_area[c] = a["id"]

    used = set(cell_area.values())
    areas = {k: v for k, v in areas.items() if k in used}
    OUT.mkdir(parents=True, exist_ok=True)
    doc = {"county": county, "h3Resolution": RES, "builtAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
           "sources": SOURCES, "areas": areas, "cells": cell_area}
    (OUT / f"{county}.json").write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")))
    (CACHE / f"report_{county}.json").write_text(json.dumps(report, ensure_ascii=False, indent=1))
    kinds = {k: sum(1 for a in areas.values() if a["kind"] == k) for k in ("town", "townland")}
    print(f"{county}: {len(cell_area)} cells, {len(areas)} areas {kinds}, "
          f"townlands w/o Logainm {len(report['townlandsWithoutLogainm'])}, urban areas unmatched {len(report['urbanAreasUnmatched'])}")
    return doc


if __name__ == "__main__":
    for c in (sys.argv[1:] or ["kildare", "dublin"]):
        build(c.lower())
