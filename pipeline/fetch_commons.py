"""
Openly licensed photos for monuments and buildings, joined EXACTLY by record number.

  Wikidata (CC0, IDs only): items carrying an SMR number (P4057) or NIAH number (P4088) and an image (P18),
  within each county's bounding box.
  Wikimedia Commons: per-file licence, author and attribution (extmetadata). Only files whose licence is in
  OPEN_LICENCES are kept; everything else is dropped.

Usage:  python pipeline/fetch_commons.py kildare dublin   (needs the boundaries cache for the bbox)
"""
import html, json, re, sys, time
from pathlib import Path
from urllib.parse import unquote
import requests
from http_util import get_json
from fetch_npws import county_bbox

CACHE = Path(__file__).resolve().parent / "cache" / "heritage"
UA = {"User-Agent": "where-am-i-pipeline/0.1 (non-commercial heritage app; github.com/BBSISK/where-am-i)"}
OPEN_LICENCES = re.compile(r"^(CC0( 1\.0)?|Public domain|PD.*|CC BY(-SA)? [1-4]\.0( [a-z]{2})?)$", re.I)
SPARQL = """SELECT ?item ?smr ?niah ?img WHERE {
  SERVICE wikibase:box { ?item wdt:P625 ?loc .
    bd:serviceParam wikibase:cornerSouthWest "Point(%f %f)"^^geo:wktLiteral .
    bd:serviceParam wikibase:cornerNorthEast "Point(%f %f)"^^geo:wktLiteral . }
  ?item wdt:P18 ?img .
  OPTIONAL { ?item wdt:P4057 ?smr } OPTIONAL { ?item wdt:P4088 ?niah }
  FILTER(BOUND(?smr) || BOUND(?niah)) }"""


def plain(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def strip_tracking(url):
    return re.sub(r"\?utm_[^#]*$", "", url)


def commons_info(filenames):
    """Licence, author and a 1280px thumbnail for up to 20 files per request (Commons API batch)."""
    out = {}
    for k in range(0, len(filenames), 20):
        batch = filenames[k:k + 20]
        try:
            d = get_json("https://commons.wikimedia.org/w/api.php", headers=UA, timeout=120, attempts=6, params={
                "action": "query", "format": "json", "prop": "imageinfo", "iiprop": "url|extmetadata",
                "iiurlwidth": 1280, "titles": "|".join(f"File:{f}" for f in batch)})
        except Exception as e:  # photos are optional: a failed batch means no photo, never a guessed one
            print(f"warning: Commons batch {k // 20} skipped ({e})")
            continue
        norm = {x["to"]: x["from"] for x in d["query"].get("normalized", [])}
        for page in d["query"]["pages"].values():
            ii = (page.get("imageinfo") or [None])[0]
            if not ii:
                continue
            m = {key: v.get("value") for key, v in ii.get("extmetadata", {}).items()}
            name = norm.get(page["title"], page["title"]).removeprefix("File:")
            out[name] = {"thumb": strip_tracking(ii.get("thumburl") or ii["url"]), "page": ii["descriptionurl"],
                         "licence": plain(m.get("LicenseShortName")), "licenceUrl": m.get("LicenseUrl"),
                         "artist": plain(m.get("Artist")) or None,
                         "attributionRequired": m.get("AttributionRequired") == "true"}
        time.sleep(3)
    return out


def main(counties):
    CACHE.mkdir(parents=True, exist_ok=True)
    for county in counties:
        county = county.lower()
        w, s, e, n = county_bbox(county)
        r = requests.get("https://query.wikidata.org/sparql", headers=UA, timeout=180,
                         params={"format": "json", "query": SPARQL % (w, s, e, n)})
        r.raise_for_status()
        rows, seen = [], set()
        for b in r.json()["results"]["bindings"]:
            filename = unquote(b["img"]["value"].rsplit("/", 1)[-1])
            key = (b.get("smr", {}).get("value"), b.get("niah", {}).get("value"), filename)
            if key not in seen:
                seen.add(key)
                rows.append((b["item"]["value"].rsplit("/", 1)[-1], *key))
        info = commons_info(sorted({row[3] for row in rows}))
        out = []
        for qid, smr, niah, filename in rows:
            i = info.get(filename) or info.get(filename.replace("_", " "))
            if i and OPEN_LICENCES.match(i["licence"] or ""):
                out.append({"wikidata": qid, "smr": smr, "niah": niah, "file": filename, **i})
        (CACHE / f"{county}_commons.json").write_text(json.dumps({
            "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "count": len(out), "results": out},
            ensure_ascii=False))
        print(f"{county}: {len(out)} openly licensed Commons photos linked to SMR/NIAH records")


if __name__ == "__main__":
    main(sys.argv[1:] or ["kildare", "dublin"])
