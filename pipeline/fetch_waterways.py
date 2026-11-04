"""
Fetch rivers (EPA WFD River Network Routes) and canals (Waterways Ireland canal polygons) per county.

Both CC BY 4.0 (data.gov.ie, checked 2026-11-04), served by the EPA GeoServer:
  Rivers:  EPA:WATER_RIVNETROUTES   publisher Environmental Protection Agency
  Canals:  EPA:WFD_Canals           publisher Waterways Ireland

Usage:  python pipeline/fetch_waterways.py kildare dublin   (needs the boundaries cache for the bbox)
"""
import json, sys, time
from pathlib import Path
from http_util import get_json
from fetch_npws import county_bbox

WFS = "https://gis.epa.ie/geoserver/EPA/ows"
LAYERS = {"rivers": ("EPA:WATER_RIVNETROUTES", "Segment_Code"), "canals": ("EPA:WFD_Canals", "Canal_Name")}
CACHE = Path(__file__).resolve().parent / "cache"


def fetch(layer, sort, bbox):
    """One WFS 2.0 request for the county bbox. GeoServer's numberMatched counts bbox-index candidates
    (e.g. 391) while the exact intersect returns fewer (349); verified identical with lng,lat and
    lat,lng axis orders and with WFS 1.0.0, 2026-11-04. So we check numberReturned, not numberMatched."""
    d = get_json(WFS, params={
        "service": "WFS", "version": "2.0.0", "request": "GetFeature", "typeNames": layer,
        "outputFormat": "application/json", "srsName": "EPSG:4326", "sortBy": sort,
        "bbox": ",".join(f"{v:.5f}" for v in bbox) + ",EPSG:4326", "count": 100000}, timeout=300)
    feats = d["features"]
    if d.get("numberReturned") != len(feats) or len(feats) >= 100000:
        sys.exit(f"{layer}: response incomplete ({len(feats)} of {d.get('numberReturned')}); refusing to write")
    ids = [f.get("id") for f in feats]
    if len(set(ids)) != len(ids):
        sys.exit(f"{layer}: duplicate features; refusing to write")
    if feats:
        lng, lat = first_xy(feats[0]["geometry"]["coordinates"])
        if not (bbox[0] - 1 <= lng <= bbox[2] + 1 and bbox[1] - 1 <= lat <= bbox[3] + 1):
            sys.exit(f"{layer}: coordinates are not lng,lat ({lng}, {lat})")
    return feats


def first_xy(c):
    while isinstance(c[0], list):
        c = c[0]
    return c[0], c[1]


def main(counties):
    (CACHE / "features").mkdir(parents=True, exist_ok=True)
    for county in counties:
        county = county.lower()
        bbox = county_bbox(county)
        for name, (layer, sort) in LAYERS.items():
            feats = fetch(layer, sort, bbox)
            out = CACHE / "features" / f"{county}_{name}.geojson"
            out.write_text(json.dumps({"type": "FeatureCollection", "layer": layer, "licence": "CC BY 4.0",
                                       "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                                       "features": feats}))
            print(f"{county}: {len(feats)} {name} -> {out.name}")
            time.sleep(1)


if __name__ == "__main__":
    main(sys.argv[1:] or ["kildare", "dublin"])
