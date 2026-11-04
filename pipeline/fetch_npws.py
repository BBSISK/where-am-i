"""
Fetch NPWS designated-site boundaries (SAC, SPA, NHA, proposed NHA) overlapping each county.

Source: National Parks and Wildlife Service, Department of Housing, Local Government and Heritage.
"Copyright Government of Ireland ... licensed for re-use under the Creative Commons Attribution 4.0
International licence." (service copyright text, checked 2026-11-04)
  https://www.arcgis.com/home/item.html?id=41c7209da92341e6b7014087c8229f46

Usage:  python pipeline/fetch_npws.py kildare dublin     (needs the boundaries cache for the bbox)
"""
import json, sys, time
from pathlib import Path
from http_util import get_json

SERVICE = "https://services-eu1.arcgis.com/Jhij7i46ouO8Cc0N/arcgis/rest/services/NPWSDesignatedAreas/FeatureServer"
ITEM = "https://www.arcgis.com/home/item.html?id=41c7209da92341e6b7014087c8229f46"
LAYERS = {0: "spa", 1: "pnha", 2: "nha", 3: "sac"}
CACHE = Path(__file__).resolve().parent / "cache"


def county_bbox(county):
    feats = json.loads((CACHE / "boundaries" / f"{county}_townlands.geojson").read_text())["features"]
    xs, ys = [], []

    def walk(c):
        if isinstance(c[0], (int, float)):
            xs.append(c[0]); ys.append(c[1])
        else:
            for x in c:
                walk(x)
    for f in feats:
        walk(f["geometry"]["coordinates"])
    return min(xs), min(ys), max(xs), max(ys)


def fetch_layer(layer, bbox):
    out, offset = [], 0
    while True:
        d = get_json(f"{SERVICE}/{layer}/query", params={
            "where": "1=1", "geometry": ",".join(f"{v:.5f}" for v in bbox), "geometryType": "esriGeometryEnvelope",
            "inSR": 4326, "spatialRel": "esriSpatialRelIntersects", "outFields": "SITECODE,SITE_NAME,COUNTY,URL",
            "returnGeometry": "true", "outSR": 4326, "geometryPrecision": 6, "f": "geojson",
            "orderByFields": "OBJECTID", "resultOffset": offset, "resultRecordCount": 200})
        batch = d.get("features", [])
        out += batch
        if len(batch) < 200:
            return out
        offset += len(batch)
        time.sleep(0.3)


def main(counties):
    (CACHE / "features").mkdir(parents=True, exist_ok=True)
    for county in counties:
        county = county.lower()
        bbox = county_bbox(county)
        feats = []
        for layer, kind in LAYERS.items():
            for f in fetch_layer(layer, bbox):
                f["properties"]["designation"] = kind
                feats.append(f)
        out = CACHE / "features" / f"{county}_npws.geojson"
        out.write_text(json.dumps({"type": "FeatureCollection", "source": ITEM, "licence": "CC BY 4.0",
                                   "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                                   "features": feats}))
        print(f"{county}: {len(feats)} NPWS polygons -> {out.name}")


if __name__ == "__main__":
    main(sys.argv[1:] or ["kildare", "dublin"])
