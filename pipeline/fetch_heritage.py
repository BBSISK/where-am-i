"""
Fetch National Monuments Service SMR and NIAH building records for given counties.

Both datasets: Copyright Government of Ireland, Department of Housing, Local Government and Heritage,
licensed for re-use under CC BY 4.0.
  SMR  (Archaeological Survey of Ireland): https://www.arcgis.com/home/item.html?id=63841b2807504a24942e44955119c339
  NIAH (National Inventory of Architectural Heritage): https://www.arcgis.com/home/item.html?id=69689ebd654e4a83af76fdb4648f8529

Usage:  python pipeline/fetch_heritage.py KILDARE DUBLIN
"""
import json, sys, time
from pathlib import Path
import requests

BASE = "https://services-eu1.arcgis.com/HyjXgkV6KGMSF3jt/arcgis/rest/services/"
DATASETS = {
    "smr": {"service": "SMROpenData", "key": "SMRS",
            "item": "https://www.arcgis.com/home/item.html?id=63841b2807504a24942e44955119c339"},
    "niah": {"service": "NIAHBuildingsOpenData", "key": "REG_NO",
             "item": "https://www.arcgis.com/home/item.html?id=69689ebd654e4a83af76fdb4648f8529"},
}
CACHE = Path(__file__).resolve().parent / "cache" / "heritage"


def query(service, where):
    url = f"{BASE}{service}/FeatureServer/0/query"
    count = requests.get(url, params={"where": where, "returnCountOnly": "true", "f": "json"}, timeout=60).json()["count"]
    rows, offset = [], 0
    while len(rows) < count:
        d = requests.get(url, params={"where": where, "outFields": "*", "returnGeometry": "false", "f": "json",
                                      "orderByFields": "OBJECTID" if service.startswith("SMR") else "OBJECTID_1",
                                      "resultOffset": offset, "resultRecordCount": 2000}, timeout=120).json()
        batch = [f["attributes"] for f in d.get("features", [])]
        if not batch:
            break
        rows += batch
        offset += len(batch)
        time.sleep(0.3)
    if len(rows) != count:
        sys.exit(f"{service} {where}: got {len(rows)} of {count}; refusing to write a partial file")
    return rows


def main(counties):
    CACHE.mkdir(parents=True, exist_ok=True)
    for county in counties:
        county = county.upper()
        for name, ds in DATASETS.items():
            rows = query(ds["service"], f"COUNTY='{county}'")
            out = CACHE / f"{county.lower()}_{name}.json"
            out.write_text(json.dumps({
                "source": name, "url": ds["item"], "licence": "CC BY 4.0",
                "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "count": len(rows), "results": rows}, ensure_ascii=False))
            print(f"{county}: {len(rows)} {name.upper()} records -> {out.name}")


if __name__ == "__main__":
    main(sys.argv[1:] or ["KILDARE", "DUBLIN"])
