"""
Build the app's area data: every H3 res-8 cell -> one area, every area -> sourced teaser sentences.

Area rules (hybrid "towns first", agreed with Barry; revised after the 2026-11-03 drive test):
  1. Townland (Tailte Éireann polygon, joined to Logainm by LOGAINM_ID) is the default area.
  2. TOWN if the cell is in a CSO Urban Area matched to exactly one Logainm TOWN record:
     same normalised name, and the Logainm town point within MATCH_KM of the urban-area polygon.
  3. SUBURB TOWN inside a large unmatched urban area (e.g. "Dublin city and suburbs"): cells within
     SUBURB_KM of a Logainm town point that lies inside that polygon go to the nearest such town
     (this makes Lucan a town rather than a string of townlands).
  4. APPROACH BUFFER: one ring of cells (~0.5 km) around every town is also that town, unless it is
     already another town, so bypasses and edge-of-town roads still trigger the town.
  Townlands mostly inside any urban area are flagged builtUp (the app does not speak them).

Inputs (from fetch_logainm.py / fetch_boundaries.py, in pipeline/cache/), output: public/data/areas/<county>.json
Usage:  python pipeline/build_areas.py kildare dublin
"""
import json, math, re, sys, time, unicodedata
from pathlib import Path
import h3
from shapely.geometry import shape, Point
from shapely.ops import nearest_points
from compose import compose, english_name, validated_irish
from heritage import select_threads

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / "cache"
OUT = ROOT.parent / "public" / "data" / "areas"
RES = 8
# Testbed (Barry, 2026-11-04): heritage threads only for these Logainm town ids until quality is reviewed.
HERITAGE_TOWNS = {17131: 'Lucan', 1416490: 'Leixlip', 1416489: 'Maynooth'}
THREADS_PER_TOWN = 8
MATCH_KM = 1.5
SUBURB_KM = 2.0
BUILT_UP_SHARE = 0.5

SOURCES = {
    "logainm": {"name": "Logainm, Placenames Database of Ireland (Gaois, DCU)", "url": "https://www.logainm.ie",
                "licence": "CC BY 4.0",
                "attribution": "Irish-language placename data by Logainm © Government of Ireland and licensed under CC BY 4.0."},
    "tailte-townlands": {"name": "Tailte Éireann, Townlands NSB 2019 (generalised 20m)",
                         "url": "https://www.arcgis.com/home/item.html?id=1dc58c98ab004234ad0445e79a0f9af7",
                         "licence": "CC BY 4.0", "attribution": "© Tailte Éireann"},
    "nms-smr": {"name": "Archaeological Survey of Ireland: Sites and Monuments Record (National Monuments Service)",
                "url": "https://maps.archaeology.ie/historicenvironment", "licence": "CC BY 4.0",
                "attribution": "Copyright Government of Ireland. Created by National Monuments Service, Department of Housing, Local Government and Heritage. Licensed under CC BY 4.0."},
    "niah": {"name": "National Inventory of Architectural Heritage", "url": "https://www.buildingsofireland.ie",
             "licence": "CC BY 4.0",
             "attribution": "Copyright Government of Ireland. Created by National Inventory of Architectural Heritage, Department of Housing, Local Government and Heritage. Licensed under CC BY 4.0."},
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


def km(a, b):
    """Haversine distance in km between two shapely Points (lon, lat)."""
    la1, la2 = math.radians(a.y), math.radians(b.y)
    dla, dlo = la2 - la1, math.radians(b.x - a.x)
    h = math.sin(dla / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin(dlo / 2) ** 2
    return 2 * 6371 * math.asin(math.sqrt(h))


def km_to_polygon(pt, geom):
    if geom.contains(pt):
        return 0.0
    return km(pt, nearest_points(geom, pt)[0])


def cell_point(c):
    lat, lng = h3.cell_to_latlng(c)
    return Point(lng, lat)


def townland_area(f, recs, report):
    p = f["properties"]
    lid = int(p["LOGAINM_ID"]) if p.get("LOGAINM_ID") and str(p["LOGAINM_ID"]).isdigit() else None
    r = recs.get(lid) if lid else None
    if r:
        return area_from_logainm(r, "townland", ["tailte-townlands"])
    name = (p.get("ENGLISH") or "").title()
    report["townlandsWithoutLogainm"].append({"TD_ID": p["TD_ID"], "name": name, "LOGAINM_ID": p.get("LOGAINM_ID")})
    text = f"{name}, a townland."
    return {"id": f"townland:td:{p['TD_ID']}", "kind": "townland", "name": name, "nameGa": None,
            "logainmId": None, "logainmUrl": None, "glossary": [], "teaser": text,
            "sentences": [{"text": text, "sourceIds": [f"tailte-townland:{p['TD_ID']}"]}],
            "sources": ["tailte-townlands"]}


def load_heritage():
    smr, niah = [], []
    for f in (CACHE / "heritage").glob("*_smr.json"):
        smr += json.loads(f.read_text())["results"]
    for f in (CACHE / "heritage").glob("*_niah.json"):
        niah += json.loads(f.read_text())["results"]
    return smr, niah


def area_for_record(lat, lng, cell_area, areas):
    """The record's own cell, or (on a county boundary, e.g. the Liffey at Leixlip) the nearest
    neighbouring cell of THIS county, preferring a town."""
    c = h3.latlng_to_cell(lat, lng, RES)
    if c in cell_area:
        return cell_area[c]
    ring = [n for n in h3.grid_disk(c, 1) if n in cell_area]
    towns = [n for n in ring if areas.get(cell_area[n], {}).get("kind") == "town"]
    pick = sorted(towns or ring)
    return cell_area[pick[0]] if pick else None


def attach_heritage(areas, cell_area, smr, niah, county=None):
    """Give testbed towns ranked 'Tell me more' threads from records of this county located in their cells."""
    by_area = {}
    for kind, rows in (("smr", smr), ("niah", niah)):
        for r in rows:
            if r.get("LATITUDE") is None or r.get("LONGITUDE") is None:
                continue
            if county and (r.get("COUNTY") or "").upper() != county.upper():
                continue
            aid = area_for_record(r["LATITUDE"], r["LONGITUDE"], cell_area, areas)
            if aid:
                by_area.setdefault(aid, {"smr": [], "niah": []})[kind].append(r)
    for aid, a in areas.items():
        if a["kind"] == "town" and a.get("logainmId") in HERITAGE_TOWNS and aid in by_area:
            threads = select_threads(by_area[aid]["smr"], by_area[aid]["niah"], limit=THREADS_PER_TOWN)
            if threads:
                a["threads"] = threads
                a["sources"] = sorted(set(a["sources"]) | {s for t in threads for s in t["sources"]})


def build_doc(tl, ua, recs, county, smr=(), niah=()):
    """Pure: townland features, urban-area features, Logainm records -> (doc, report)."""
    towns = towns_by_name(recs)
    areas, cell_area = {}, {}
    report = {"townlandsWithoutLogainm": [], "urbanAreasUnmatched": [], "matchedByDistance": [], "suburbTowns": []}

    # 1. townlands (default)
    tl_cells = {}
    for f in tl:
        a = townland_area(f, recs, report)
        areas[a["id"]] = a
        cs = cells_for(shape(f["geometry"]))
        tl_cells[a["id"]] = cs
        for c in cs:
            cell_area[c] = a["id"]

    # built-up cells = inside ANY urban area (matched or not)
    ua_geoms = [(f["properties"], shape(f["geometry"])) for f in ua]
    built_up = set()
    for _, g in ua_geoms:
        built_up |= set(cells_for(g))

    town_core = {}  # town area id -> set(cells)

    # 2. urban areas matched to one Logainm town
    unmatched = []
    for p, g in ua_geoms:
        cands = [r for r in towns.get(norm(p["URBAN_AREA_NAME"]), [])
                 if (pt := logainm_point(r)) and km_to_polygon(pt, g) <= MATCH_KM]
        if len(cands) != 1:
            report["urbanAreasUnmatched"].append({"name": p["URBAN_AREA_NAME"], "code": p["URBAN_AREA_CODE"], "candidates": len(cands)})
            unmatched.append((p, g))
            continue
        r = cands[0]
        if not g.contains(logainm_point(r)):
            report["matchedByDistance"].append({"name": p["URBAN_AREA_NAME"], "logainmId": r["id"],
                                                "km": round(km_to_polygon(logainm_point(r), g), 2)})
        a = area_from_logainm(r, "town", ["tailte-urban"])
        a["urbanAreaCode"] = p["URBAN_AREA_CODE"]
        areas[a["id"]] = a
        town_core[a["id"]] = set(cells_for(g))

    # 3. suburb towns inside large unmatched urban areas
    matched_ids = {aid.split(":")[-1] for aid in town_core}
    for p, g in unmatched:
        centres = [(r, logainm_point(r)) for lst in towns.values() for r in lst
                   if logainm_point(r) and g.contains(logainm_point(r)) and str(r["id"]) not in matched_ids]
        if not centres:
            continue
        for c in cells_for(g):
            cp = cell_point(c)
            best = min(((km(cp, pt), r) for r, pt in centres), key=lambda t: t[0])
            if best[0] <= SUBURB_KM:
                a = area_from_logainm(best[1], "town", ["tailte-urban"])
                areas.setdefault(a["id"], a)
                town_core.setdefault(a["id"], set()).add(c)
        for r, _ in centres:
            aid = f"town:logainm:{r['id']}"
            if aid in town_core:
                report["suburbTowns"].append({"urbanArea": p["URBAN_AREA_NAME"], "town": english_name(r),
                                              "logainmId": r["id"], "cells": len(town_core[aid])})

    # assign town cores (deterministic order)
    all_core = set()
    for aid in sorted(town_core):
        for c in town_core[aid]:
            cell_area[c] = aid
        all_core |= town_core[aid]

    # 4. approach buffer: one ring around each town, never over another town's core
    for aid in sorted(town_core):
        for c in town_core[aid]:
            for n in h3.grid_disk(c, 1):
                # only cells of THIS county's townlands, so towns never spill into a neighbouring county's file
                if n not in all_core and n in cell_area and cell_area[n].startswith("townland:"):
                    cell_area[n] = aid

    # builtUp flag on townlands
    for aid, cs in tl_cells.items():
        if cs:
            areas[aid]["builtUp"] = sum(1 for c in cs if c in built_up) / len(cs) > BUILT_UP_SHARE

    used = set(cell_area.values())
    areas = {k: v for k, v in areas.items() if k in used}
    attach_heritage(areas, cell_area, smr, niah, county)
    doc = {"county": county, "h3Resolution": RES, "builtAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
           "sources": SOURCES, "areas": areas, "cells": cell_area}
    return doc, report


def build(county):
    recs = load_logainm()
    tl = json.loads((CACHE / "boundaries" / f"{county}_townlands.geojson").read_text())["features"]
    ua = json.loads((CACHE / "boundaries" / f"{county}_urban_areas.geojson").read_text())["features"]
    smr, niah = load_heritage()
    doc, report = build_doc(tl, ua, recs, county, smr, niah)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{county}.json").write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")))
    (CACHE / f"report_{county}.json").write_text(json.dumps(report, ensure_ascii=False, indent=1))
    areas = doc["areas"]
    kinds = {k: sum(1 for a in areas.values() if a["kind"] == k) for k in ("town", "townland")}
    print(f"{county}: {len(doc['cells'])} cells, {len(areas)} areas {kinds}; "
          f"urban areas unmatched {len(report['urbanAreasUnmatched'])}, matched by distance {len(report['matchedByDistance'])}, "
          f"suburb towns {[t['town'] for t in report['suburbTowns']]}")
    return doc


def update_index():
    counties = sorted(f.stem for f in OUT.glob("*.json") if f.name != "index.json")
    (OUT / "index.json").write_text(json.dumps({"counties": counties}))


if __name__ == "__main__":
    for c in (sys.argv[1:] or ["kildare", "dublin"]):
        build(c.lower())
    update_index()
