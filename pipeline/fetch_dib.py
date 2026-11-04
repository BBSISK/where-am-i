"""
People born in the testbed towns, from the Dictionary of Irish Biography (Royal Irish Academy).

Linking (IDs only, never narration): Wikidata (CC0)
  place  --P5097 Logainm ID-->  Wikidata item  <--P19 place of birth--  person  --P6829 DIB ID-->  DIB entry
Text: the DIB entry itself, which is licensed CC BY-NC 4.0 ("This content is licensed under a Creative
Commons Attribution Non Commercial 4.0 International license", entry pages, checked 2026-11-04).
Used under the non-commercial decision (SOURCES.md); behind NON_COMMERCIAL_SOURCES in build_areas.py.

Politeness: dib.ie robots.txt asks for Crawl-delay: 30 and disallows /search, so we never search: each
entry is reached through its DOI (https://doi.org/10.3318/dib.<id>.v1), one request every 30 seconds.

Usage:  python pipeline/fetch_dib.py
"""
import html, json, re, sys, time
from pathlib import Path
import requests

CACHE = Path(__file__).resolve().parent / "cache" / "heritage"
TOWNS = {"17131": "Lucan", "1416490": "Leixlip", "1416489": "Maynooth"}  # Logainm ids (testbed)
UA = {"User-Agent": "where-am-i-pipeline/0.1 (non-commercial heritage app; github.com/BBSISK/where-am-i)"}
SPARQL = """SELECT ?person ?dib ?logainm WHERE {
  VALUES ?logainm { %s }
  ?place wdt:P5097 ?logainm . ?person wdt:P19 ?place ; wdt:P6829 ?dib . }"""
CRAWL_DELAY = 30


def wikidata_links():
    q = SPARQL % " ".join(f'"{k}"' for k in TOWNS)
    r = requests.get("https://query.wikidata.org/sparql", params={"format": "json", "query": q}, headers=UA, timeout=120)
    r.raise_for_status()
    return [{"wikidata": b["person"]["value"].rsplit("/", 1)[-1], "dibId": b["dib"]["value"],
             "logainmId": int(b["logainm"]["value"])} for b in r.json()["results"]["bindings"]]


def _text(fragment):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def parse_entry(page):
    """Title, contributor (as 'First Last'), first paragraph and licence line from a DIB entry page."""
    title = _text(re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S).group(1))
    m = re.search(r"Contributed by</strong>\s*<div[^>]*>\s*<a[^>]*>(.*?)</a>", page, re.S)
    contributor = _text(m.group(1)) if m else None
    if contributor and "," in contributor:
        last, first = [p.strip() for p in contributor.split(",", 1)]
        contributor = f"{first} {last}"
    body = page[page.find("field--name-body"):]
    p = re.search(r"<p[^>]*>(.*?)</p>", body, re.S)
    licence = "CC BY-NC 4.0" if "Attribution Non Commercial 4.0" in page else None
    return {"title": title, "contributor": contributor, "firstParagraph": _text(p.group(1)) if p else "",
            "licence": licence}


def main():
    """Incremental: entries already cached are kept (DIB entries rarely change); only new links are fetched.
    Links that disappeared from Wikidata are dropped. Pass --full to refetch everything."""
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / "dib.json"
    old = {} if "--full" in sys.argv or not path.exists() else {
        (r["dibId"], r["logainmId"]): r for r in json.loads(path.read_text())["results"]}
    out, fetched = [], 0
    for link in wikidata_links():
        kept = old.get((link["dibId"], link["logainmId"]))
        if kept:
            out.append(kept)
            continue
        if fetched:
            time.sleep(CRAWL_DELAY)
        fetched += 1
        doi = f"https://doi.org/10.3318/dib.{link['dibId']}.v1"
        r = requests.get(doi, headers=UA, timeout=120)
        if r.status_code != 200 or "dib.ie/biography/" not in r.url:
            print(f"skip {link['dibId']}: {r.status_code} {r.url}")
            continue
        entry = parse_entry(r.text)
        if entry["licence"] != "CC BY-NC 4.0":
            sys.exit(f"{r.url}: licence line not found or changed; refusing to continue")
        out.append(dict(link, **entry, url=r.url, doi=doi, town=TOWNS[str(link["logainmId"])]))
        print(f"{link['dibId']} {entry['title'][:60]}")
    (CACHE / "dib.json").write_text(json.dumps({
        "licence": "CC BY-NC 4.0", "pulledAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(out), "results": out}, ensure_ascii=False))
    print(f"{len(out)} DIB entries ({fetched} fetched, {len(out) - fetched} from cache)")


if __name__ == "__main__":
    main()
