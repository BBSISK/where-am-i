"""
Fetch Geological Survey Ireland audited geological heritage sites (County Geological Sites) per county.

Geological Survey Ireland, CC BY 4.0 (data.gov.ie "gsi-county-geological-heritage-sites-audited", checked 2026-11-04):
  https://gsi.geodata.gov.ie/server/rest/services/Geoheritage/IE_GSI_Geoheritage_Audited_Sites_IE26_ITM/MapServer

Usage:  python pipeline/fetch_gsi.py kildare dublin   (needs the boundaries cache for the bbox)
"""
import json, sys, time
from pathlib import Path
from pyproj import Transformer
from http_util import get_json
from fetch_npws import county_bbox

LAYER = ("https://gsi.geodata.gov.ie/server/rest/services/Geoheritage/"
         "IE_GSI_Geoheritage_Audited_Sites_IE26_ITM/MapServer/0")
CACHE = Path(__file__).resolve().parent / "cache" / "heritage"
DUBLIN = {"South Dublin", "Fingal", "Dublin City", "Dún Laoghaire-Rathdown", "Dun Laoghaire-Rathdown", "Dublin"}
ITM_TO_WGS84 = Transformer.from_crs(2157, 4326, always_xy=True)


def fetch(bbox):
    d = get_json(f"{LAYER}/query", params={
        "where": "1=1", "geometry": ",".join(f"{v:.5f}" for v in bbox), "geometryType": "esriGeometryEnvelope",
        "inSR": 4326, "spatialRel": "esriSpatialRelIntersects", "outFields": "*", "returnGeometry": "false",
        "f": "json"})
    if d.get("exceededTransferLimit"):
        sys.exit("GSI: transfer limit exceeded; refusing to write a partial file")
    return [f["attributes"] for f in d["features"]]


def main(counties):
    CACHE.mkdir(parents=True, exist_ok=True)
    for county in counties:
        county = county.lower()
        rows = []
        for p in fetch(county_bbox(county)):
            c = p.get("COUNTY") or ""
            in_county = c in DUBLIN if county == "dublin" else c.lower() == county
            if not in_county or p.get("X_ITM") is None:
                continue
            # the service returns no geometry; the record's own ITM point (X_ITM, Y_ITM) locates the site
            lng, lat = ITM_TO_WGS84.transform(p["X_ITM"], p["Y_ITM"])
            rows.append(dict(p, LATITUDE=lat, LONGITUDE=lng, COUNTY=county.upper()))
        (CACHE / f"{county}_gsi.json").write_text(json.dumps({
            "source": LAYER, "licence": "CC BY 4.0", "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "count": len(rows), "results": rows}, ensure_ascii=False))
        print(f"{county}: {len(rows)} GSI audited geological sites")


if __name__ == "__main__":
    main(sys.argv[1:] or ["kildare", "dublin"])
