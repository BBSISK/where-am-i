"""
Fetch Tailte Éireann townland boundaries for given counties as GeoJSON (WGS84).

Dataset: Townlands - National Statutory Boundaries - 2019 - Generalised 20m (Tailte Éireann)
Licence: CC BY 4.0. Attribution: (c) Tailte Éireann. Generalised boundaries: for reference only.
https://data-osi.opendata.arcgis.com/datasets/osi::townlands-national-statutory-boundaries-2019-generalised-20m
Each feature carries LOGAINM_ID, which joins it to the Logainm record.

Usage:  python pipeline/fetch_boundaries.py KILDARE DUBLIN
"""
import json, sys, time
from pathlib import Path
import requests

SERVICE = ("https://services-eu1.arcgis.com/FH5XCsx8rYXqnjF5/arcgis/rest/services/"
           "Townlands_OSi_National_Statutory_Boundaries___Generalised_20m/FeatureServer/0")
ITEM = "https://www.arcgis.com/home/item.html?id=1dc58c98ab004234ad0445e79a0f9af7"
CACHE = Path(__file__).resolve().parent / "cache" / "boundaries"
FIELDS = "TD_ID,ENGLISH,GAEILGE,LOGAINM_ID,COUNTY,AREA"


def count(county):
    r = requests.get(f"{SERVICE}/query", params={"where": f"COUNTY='{county}'", "returnCountOnly": "true", "f": "json"}, timeout=60)
    r.raise_for_status()
    return r.json()["count"]


def fetch(county):
    feats, offset = [], 0
    while True:
        r = requests.get(f"{SERVICE}/query", params={
            "where": f"COUNTY='{county}'", "outFields": FIELDS, "outSR": 4326, "f": "geojson",
            "orderByFields": "ESRI_OID", "resultOffset": offset, "resultRecordCount": 1000}, timeout=120)
        r.raise_for_status()
        batch = r.json().get("features", [])
        feats += batch
        if len(batch) < 1000:
            return feats
        offset += len(batch)
        time.sleep(0.3)


URBAN_SERVICE = ("https://services-eu1.arcgis.com/BuS9rtTsYEV5C0xh/arcgis/rest/services/"
                 "Urban_Areas_National_Statistical_Boundaries_2022_Generalised_20m/FeatureServer/5")
URBAN_ITEM = "https://www.arcgis.com/home/item.html?id=5468708d36454d1f95a3ff23cbaeb2f5"


def fetch_urban(county_title):
    """CSO Urban Areas 2022 (Tailte Éireann, CC BY 4.0) for one county, e.g. 'Kildare'."""
    params = {"where": f"COUNTY='{county_title}'", "outFields": "URBAN_AREA_GUID,URBAN_AREA_CODE,URBAN_AREA_NAME,COUNTY",
              "outSR": 4326, "f": "geojson", "resultRecordCount": 2000}
    r = requests.get(f"{URBAN_SERVICE}/query", params=params, timeout=120)
    r.raise_for_status()
    return r.json().get("features", [])


def main(counties):
    CACHE.mkdir(parents=True, exist_ok=True)
    for c in counties:
        c = c.upper()
        expected = count(c)
        feats = fetch(c)
        if len(feats) != expected or expected == 0:
            sys.exit(f"{c}: got {len(feats)} of {expected}; refusing to write a partial file")
        out = CACHE / f"{c.lower()}_townlands.geojson"
        out.write_text(json.dumps({
            "type": "FeatureCollection",
            "metadata": {"source": "Tailte Éireann, Townlands NSB 2019 Generalised 20m", "url": ITEM,
                         "licence": "CC BY 4.0", "attribution": "© Tailte Éireann",
                         "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())},
            "features": feats}, ensure_ascii=False))
        print(f"{c}: {len(feats)} townland polygons -> {out.name}")
        urban = fetch_urban(c.title())
        out2 = CACHE / f"{c.lower()}_urban_areas.geojson"
        out2.write_text(json.dumps({
            "type": "FeatureCollection",
            "metadata": {"source": "Tailte Éireann / CSO, Urban Areas 2022 Generalised 20m", "url": URBAN_ITEM,
                         "licence": "CC BY 4.0", "attribution": "© Tailte Éireann",
                         "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())},
            "features": urban}, ensure_ascii=False))
        print(f"{c}: {len(urban)} urban areas -> {out2.name}")


if __name__ == "__main__":
    main(sys.argv[1:] or ["KILDARE", "DUBLIN"])
