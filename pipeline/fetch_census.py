"""
Fetch Census 2022 town populations from the CSO (PxStat API).

Table: SAP2022T1T1TOWN22 "Population" (Census 2022 Small Area Population Statistics, Theme 1, by Town).
Licence: CC BY 4.0, Central Statistics Office. https://data.cso.ie/table/SAP2022T1T1TOWN22
Town codes in this table are the URBAN_AREA_GUIDs of the Tailte Éireann / CSO Urban Areas 2022 boundaries,
so the join to our town areas is exact.

Usage:  python pipeline/fetch_census.py
"""
import json, time
from pathlib import Path
from http_util import get_json

TABLE = "SAP2022T1T1TOWN22"
URL = f"https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/{TABLE}/JSON-stat/2.0/en"
CACHE = Path(__file__).resolve().parent / "cache" / "census"
TOWN_DIM, AGE_DIM, SEX_DIM = "C04160V04929", "C03737V04485", "C03738V04487"


def town_populations(d):
    """JSON-stat 2.0 -> {guid: {"name": label, "population": int}} for all ages, both sexes."""
    dims, sizes = d["id"], d["size"]

    def index(dim):
        ix = d["dimension"][dim]["category"]["index"]
        return ix if isinstance(ix, dict) else {k: i for i, k in enumerate(ix)}

    I = {k: index(k) for k in dims}

    def value(sel):
        i = 0
        for k, s in zip(dims, sizes):
            i = i * s + (I[k][sel[k]] if k in sel else 0)
        return d["value"][i]

    labels = d["dimension"][TOWN_DIM]["category"]["label"]
    out = {}
    for guid in I[TOWN_DIM]:
        v = value({TOWN_DIM: guid, AGE_DIM: "AGET", SEX_DIM: "B"})
        if v is not None:
            out[guid] = {"name": labels[guid], "population": int(v)}
    return out


def main():
    d = get_json(URL, timeout=180)
    towns = town_populations(d)
    CACHE.mkdir(parents=True, exist_ok=True)
    out = CACHE / "towns_2022.json"
    out.write_text(json.dumps({
        "source": "CSO Census 2022 SAPS", "table": TABLE, "url": f"https://data.cso.ie/table/{TABLE}",
        "licence": "CC BY 4.0", "updated": d.get("updated"),
        "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "towns": towns}, ensure_ascii=False))
    print(f"{len(towns)} towns -> {out.name}")


if __name__ == "__main__":
    main()
