"""
Fetch county Records of Protected Structures (RPS), normalised to one record shape.

  Kildare County Council, RPS 2023-2029 (GeoPackage), cc-by:
    https://data.kildarecoco.ie/dataset/55daa18c-7e1f-4267-b421-26699f79c110
  South Dublin County Council, RPS 2022-2028 (ArcGIS), CC BY 4.0
    ("Contains Irish Public Sector Data licensed under a CC BY 4.0 licence"):
    https://www.arcgis.com/home/item.html?id=223a9302e62f4bb68317d0566a70644d

Usage:  python pipeline/fetch_rps.py
"""
import json, sqlite3, tempfile, time
from pathlib import Path
import requests
from http_util import get_json

CACHE = Path(__file__).resolve().parent / "cache" / "heritage"
KCC_PKG = "https://data.kildarecoco.ie/api/3/action/package_show?id=55daa18c-7e1f-4267-b421-26699f79c110"
KCC_PAGE = "https://data.kildarecoco.ie/dataset/55daa18c-7e1f-4267-b421-26699f79c110"
SDCC = ("https://services1.arcgis.com/PxbTDTskGHCe4sv6/arcgis/rest/services/"
        "Record_of_Protected_Structures_South_Dublin_County_Development_Plan_2022_to_2028/FeatureServer/0")
SDCC_PAGE = "https://www.arcgis.com/home/item.html?id=223a9302e62f4bb68317d0566a70644d"


def kildare():
    pkg = get_json(KCC_PKG)["result"]
    assert pkg.get("license_id") == "cc-by", pkg.get("license_id")
    url = next(r["url"] for r in pkg["resources"] if r["url"].endswith(".gpkg"))
    with tempfile.TemporaryDirectory() as d:
        p = Path(d) / "rps.gpkg"
        r = requests.get(url, timeout=300)
        r.raise_for_status()
        p.write_bytes(r.content)
        con = sqlite3.connect(p)
        table = con.execute("select table_name from gpkg_contents").fetchone()[0]
        rows = con.execute(f"select RPS_No, Structure, Descr, NIAH_No, SMR_No, Latitude, Longitude from '{table}'").fetchall()
    out = []
    for rps, structure, descr, niah, smr, lat, lng in rows:
        if lat is None or lng is None:
            continue
        out.append({"council": "Kildare County Council", "councilKey": "kcc", "rpsNo": rps, "name": structure,
                    "descr": descr, "niahNo": niah or None, "smrNo": (smr or "").strip() or None,
                    "lat": lat, "lng": lng, "url": KCC_PAGE, "file": url.rsplit("/", 1)[-1]})
    return out


def south_dublin():
    out, offset = [], 0
    while True:
        d = get_json(f"{SDCC}/query", params={"where": "1=1", "outFields": "RPS_NUMBER,RPS_Sub_No,AddressLoc,Descriptio",
                                               "returnGeometry": "true", "outSR": 4326, "f": "json",
                                               "orderByFields": "FID", "resultOffset": offset, "resultRecordCount": 1000})
        batch = d.get("features", [])
        for f in batch:
            a, g = f["attributes"], f.get("geometry") or {}
            if "x" not in g:
                continue
            out.append({"council": "South Dublin County Council", "councilKey": "sdcc",
                        "rpsNo": a.get("RPS_Sub_No") or a.get("RPS_NUMBER"), "name": a.get("AddressLoc"),
                        "descr": a.get("Descriptio"), "niahNo": None, "smrNo": None,
                        "lat": g["y"], "lng": g["x"], "url": SDCC_PAGE})
        if len(batch) < 1000:
            return out
        offset += len(batch)
        time.sleep(0.3)


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    for county, fn in (("kildare", kildare), ("dublin", south_dublin)):
        rows = fn()
        for r in rows:  # same location keys as SMR / NIAH records, so build_areas attaches them the same way
            r.update({"LATITUDE": r["lat"], "LONGITUDE": r["lng"], "COUNTY": county.upper()})
        (CACHE / f"{county}_rps.json").write_text(json.dumps({
            "licence": "CC BY 4.0", "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "count": len(rows), "results": rows}, ensure_ascii=False))
        print(f"{county}: {len(rows)} RPS records")


if __name__ == "__main__":
    main()
