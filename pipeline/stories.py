"""
Story-style narration: short teasers and ~1-minute "Tell me more" stories, written in our own words
FROM THE SOURCE RECORDS ONLY (CC BY 4.0 sources allow adaptation with attribution; see SOURCES.md).

Files: pipeline/review/stories/<town>.json (hand-written / reviewed; the pipeline never edits them except
`--freeze`, which records the hash of each source record the story was written from).

Rigour, enforced at build time and in tests:
  1. Fact check: every number/year/ordinal and every proper name in a story must appear in the text of the
     source records it cites (accents, number words and ordinals normalised). Fails the build otherwise.
  2. Freshness: if a cited source record's text has changed since the story was written (hash mismatch),
     the story is NOT spoken until it is re-checked and re-frozen.
  3. References are shown on screen ("Sources: ... adapted"), never spoken.
  4. Status: "draft" until Barry signs the town off (status "approved"); the audit page shows which.

Usage:  python pipeline/stories.py --freeze pipeline/review/stories/maynooth.json   (local check + freeze)
"""
import hashlib, json, re, sys, unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
STORIES = HERE / "review" / "stories"

NUMBER_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9,
    "ten": 10, "eleven": 11, "twelve": 12, "first": "1st", "second": "2nd", "third": "3rd", "fourth": "4th",
    "fifth": "5th", "sixth": "6th", "seventh": "7th", "eighth": "8th", "ninth": "9th", "tenth": "10th",
    "eleventh": "11th", "twelfth": "12th", "thirteenth": "13th", "fourteenth": "14th", "fifteenth": "15th",
    "sixteenth": "16th", "seventeenth": "17th", "eighteenth": "18th", "nineteenth": "19th", "twentieth": "20th",
}
# Capitalised words that are not claims (sentence starters, pronouns, grammar). Anything else that is
# capitalised is treated as a name and must appear in the cited sources.
NOT_NAMES = set("""a an and as at after all also around back before but by down each either even every for from
had has have he her here his how i if in inside into it its it's just later long many may more most much near
next not now of on once one only or our out over say says she so some still such that the their them then
there these they this those though through to today two under until up was we well were what when where which
while who whose with within yes you your welcome records record look high just later""".split())
NOT_NAMES |= {"irish", "i'll", "it's", "that's", "there's", "what's", "here's", "let's"}
NOT_NAMES |= set("""about among along although another anyone because behind beside besides between beyond both
during finally few however instead meanwhile nearly neither nobody none nothing perhaps quite rather really
several since something somewhere soon then though thus together unlike unless very whether why without yet
another eventually originally later known""".split())


def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))


def norm(text):
    t = strip_accents(text or "").lower()
    t = t.replace("’", "'").replace("‘", "'").replace("–", "-").replace("—", "-")
    t = re.sub(r"(?<=\d),(?=\d{3}\b)", "", t)               # 17,259 -> 17259
    # abbreviated year ranges: 1845-51 -> 1845-1851, 1796-9 -> 1796-1799
    t = re.sub(r"\b(1\d)(\d\d)-(\d\d)\b", r"\1\2-\1\3", t)
    t = re.sub(r"\b(1\d\d)(\d)-(\d)\b", r"\1\2-\1\3", t)
    t = re.sub(r"\b(\w+)\b", lambda m: str(NUMBER_WORDS.get(m.group(1), m.group(1))), t)
    t = re.sub(r"(\d)c\b", r"\1th", t)                     # "14thC" style
    return t


def stem(w):
    w = w.lower().strip("'")
    for suf in ("'s", "s'"):
        if w.endswith(suf):
            w = w[: -len(suf)]
    return w[:-1] if len(w) > 4 and w.endswith("s") else w


def fact_check(text, source_text):
    """Problems (empty list = passes). Numbers and proper names must be in the cited sources."""
    src = norm(source_text)
    problems = []
    for n in re.findall(r"\d+", norm(text)):
        if not re.search(rf"(?<!\d){n}(?!\d)", src):
            problems.append(f"number {n} not in sources")
    for w in re.findall(r"\b[A-ZÁÉÍÓÚ][\w'’.-]*", text):
        base = strip_accents(w).replace("’", "'").rstrip(".-'")
        if not base or base.lower() in NOT_NAMES or stem(base).lower() in NOT_NAMES or base.lower() in NUMBER_WORDS:
            continue
        if re.fullmatch(r"[A-Z](\.[A-Z])*\.?", base):          # initials like J.J.
            continue
        if stem(base).lower() not in src:
            problems.append(f"name '{w}' not in sources")
    return sorted(set(problems))


def source_text(sid, ctx):
    """The text of one cited source record, as used for the fact check and the freshness hash."""
    kind, _, key = sid.partition(":")
    if kind == "smr":
        r = ctx["smr"].get(key)
        return r and f"{r.get('MONUMENT_CLASS')}. {r.get('TOWNLAND')}. {r.get('WEB_NOTES') or ''}"
    if kind == "niah":
        r = ctx["niah"].get(key)
        return r and (f"{r.get('NAME')}. {r.get('STREET1') or ''}, {r.get('TOWN') or ''}. Rated {r.get('RATING')}. "
                      f"{r.get('ORIGINAL_TYPE')}. {r.get('DESCRIPTION') or ''} {r.get('APPRAISAL') or ''}")
    if kind == "nms-mtv":
        r = ctx["mtv"].get(key)
        return r and f"{r.get('NAME')}. {r.get('MonumentsToVisit_INFO') or ''}"
    if kind == "rps":
        r = ctx["rps"].get(key)
        return r and f"{r.get('name')}. {r.get('descr')}. {r.get('council')} Record of Protected Structures."
    if kind == "gsi":
        r = ctx["gsi"].get(key)
        return r and f"{r.get('SITENAME')}. {r.get('DESCRIPT') or ''}. {r.get('GEOLOGICAL') or ''}"
    if kind == "dib":
        r = ctx["dib"].get(key)
        return r and f"{r.get('title')}. {r.get('firstParagraph') or ''}"
    if kind == "logainm":
        a = ctx["logainm"].get(key)
        return a and f"{a['name']} | {a.get('nameGa') or ''} | {a['kind']}"
    if kind == "logainm-glossary":
        g = ctx["glossary"].get(key)
        return g and f"{g['headword']} = {g['translation']}"
    if kind == "cso":
        guid = key.rsplit(":", 1)[-1]
        c = ctx["census"].get(guid)
        return c and f"{c['name']}: population {c['population']} at the 2022 census (CSO)."
    return None


def digest(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


def make_ctx(areas, smr=(), niah=(), mtv=(), rps=(), gsi=(), dib=(), census=None, commons=(), niah_images=True):
    from heritage import commons_index
    gl = {}
    for a in areas.values():
        for g in a.get("glossary") or []:
            gl[str(g["id"])] = g
    return {
        "smr": {r["SMRS"]: r for r in smr}, "niah": {str(r["REG_NO"]): r for r in niah},
        "mtv": {r["ENTITY_ID"]: r for r in mtv}, "rps": {f"{r['councilKey']}:{r['rpsNo']}": r for r in rps},
        "gsi": {r["SITECODE"]: r for r in gsi}, "dib": {r["dibId"]: r for r in dib},
        "logainm": {str(a["logainmId"]): a for a in areas.values() if a.get("logainmId")},
        "glossary": gl, "census": census or {},
        "commons": commons_index(commons), "niahImages": niah_images,
    }


def record_label(sid, ctx):
    """What a record's photo shows, from the record itself (NIAH name); None when unknown."""
    if sid.startswith("niah:"):
        r = ctx["niah"].get(sid.split(":", 1)[1])
        if not r:
            return None
        if r.get("NAME"):
            return r["NAME"]
        kind = re.sub(r"\s*\(.*?\)", "", r.get("ORIGINAL_TYPE") or "building")
        where = f" on {r['STREET1']}" if r.get("STREET1") else (f" in {r['TOWN']}" if r.get("TOWN") else "")
        return f"A {kind}{where}"
    return None


def image_for(sid, ctx, subject):
    """Exact-join photo for one cited record: Commons first (open licence), then the NIAH survey photo."""
    from heritage import commons_image, niah_image
    c = ctx.get("commons", {}).get(sid.rstrip("-"))
    if c:
        return commons_image(c, subject)
    if sid.startswith("niah:") and ctx.get("niahImages"):
        r = ctx["niah"].get(sid.split(":", 1)[1])
        return r and niah_image(r)
    return None


def check_item(item, ctx, frozen):
    """-> (ok, reason). Missing source, changed source or failed fact check all block the item."""
    texts = []
    for sid in item["sourceIds"]:
        t = source_text(sid, ctx)
        if t is None:
            return False, f"source {sid} not found"
        if frozen is not None and frozen.get(sid) != digest(t):
            return False, f"source {sid} changed since the story was written"
        texts.append(t)
    problems = fact_check(item["text"], "\n".join(texts))
    return (not problems), "; ".join(problems) or "ok"


SOURCE_LABEL = {
    "smr": "National Monuments Service, Sites and Monuments Record", "nms-mtv": "National Monuments Service, Monuments to Visit",
    "niah": "National Inventory of Architectural Heritage", "rps": "County council Record of Protected Structures",
    "gsi": "Geological Survey Ireland", "dib": "Dictionary of Irish Biography (CC BY-NC 4.0)",
    "logainm": "Logainm", "logainm-glossary": "Logainm glossary", "cso": "CSO Census 2022",
}


def sources_markdown(sids):
    kinds = []
    for sid in sids:
        k = sid.split(":", 1)[0]
        if k not in kinds:
            kinds.append(k)
    labels = "; ".join(SOURCE_LABEL.get(k, k) for k in kinds)
    return (f"Sources (adapted, not quoted): {labels}. Records: {', '.join(sids)}. "
            f"Licensed CC BY 4.0 unless stated; this narration is our own summary of those records.")


def apply_stories(areas, county, ctx, story_dir=STORIES):
    """Replace testbed towns' threads and teaser with checked stories. Returns a report list."""
    report = []
    for f in sorted(Path(story_dir).glob("*.json")):
        doc = json.loads(f.read_text())
        if doc.get("county") != county or doc["areaId"] not in areas:
            continue
        a = areas[doc["areaId"]]
        frozen = doc.get("sourceHashes", {})
        images = {}   # sourceId -> image, labelled with what it actually shows
        for t in a.get("threads", []):
            if t.get("image"):
                for sid in t["sourceIds"]:
                    images.setdefault(sid, dict(t["image"], depicts=t["title"]))
        teaser = doc.get("teaser")
        if teaser:
            ok, why = check_item(teaser, ctx, frozen)
            report.append({"file": f.name, "item": "teaser", "ok": ok, "reason": why})
            if ok:
                a["teaser"] = teaser["text"]
                a["sentences"] = [{"text": teaser["text"], "sourceIds": teaser["sourceIds"]}]
        stories = []
        for s in doc.get("stories", []):
            ok, why = check_item(s, ctx, frozen)
            report.append({"file": f.name, "item": s["id"], "ok": ok, "reason": why})
            if not ok:
                continue
            order = [s["imageFrom"]] if s.get("imageFrom") else []
            order += s["sourceIds"]
            img = next((images[x] for x in order if x in images), None)
            if not img:
                for x in order:
                    label = record_label(x, ctx)
                    i = image_for(x, ctx, label or s["title"])
                    if i:
                        img = dict(i, depicts=label) if label else i
                        break
            first = re.split(r"(?<=[.!?])\s", s["text"], maxsplit=1)[0]
            t = {"id": f"story-{s['id']}", "category": s.get("category", "history"), "title": s["title"],
                 "hookSnippet": first, "spokenNarrative": s["text"], "detailMarkdown": sources_markdown(s["sourceIds"]),
                 "sourceIds": s["sourceIds"], "sources": sorted({x.split(':', 1)[0] for x in s["sourceIds"]})}
            if img:
                t["image"] = img
            stories.append(t)
        if stories:
            a["threads"] = stories
        a["storyStatus"] = doc.get("status", "draft")
        a["storyReport"] = [r for r in report if r["file"] == f.name and not r["ok"]]
        reg = {"smr": "nms-smr", "nms-mtv": "nms-mtv", "niah": "niah", "rps": None, "gsi": "gsi", "dib": "dib",
               "logainm": "logainm", "logainm-glossary": "logainm", "cso": "cso-census"}
        used = set()
        for t in a.get("threads", []):
            for sid in t["sourceIds"]:
                k = sid.split(":", 1)[0]
                used.add(f"rps-{sid.split(':')[1]}" if k == "rps" else reg.get(k) or k)
            t["sources"] = sorted({(f"rps-{x.split(':')[1]}" if x.startswith("rps:") else reg.get(x.split(':', 1)[0]))
                                   for x in t["sourceIds"]})
            if t.get("image"):
                used.add(t["image"]["sourceId"])
        base = {x for x in a["sources"] if x in ("logainm", "tailte-urban", "tailte-townlands", "cso-census")}
        a["sources"] = sorted(base | used)
    return report


def freeze(path, ctx):
    doc = json.loads(Path(path).read_text())
    hashes, failures = {}, []
    for item in [doc.get("teaser")] + doc.get("stories", []):
        if not item:
            continue
        ok, why = check_item(item, ctx, None)
        if not ok:
            failures.append(f"{item.get('id', 'teaser')}: {why}")
        for sid in item["sourceIds"]:
            hashes[sid] = digest(source_text(sid, ctx))
    if failures:
        sys.exit("fact check failed:\n  " + "\n  ".join(failures))
    doc["sourceHashes"] = dict(sorted(hashes.items()))
    Path(path).write_text(json.dumps(doc, indent=1, ensure_ascii=False) + "\n")
    words = {i.get("id", "teaser"): len(i["text"].split()) for i in [doc.get("teaser")] + doc["stories"] if i}
    print("fact check passed; hashes frozen. words:", words)


if __name__ == "__main__" and len(sys.argv) == 3 and sys.argv[1] == "--freeze":
    import build_areas as b
    county = json.loads(Path(sys.argv[2]).read_text())["county"]
    areas = json.loads((HERE.parent / "public" / "data" / "areas" / f"{county}.json").read_text())["areas"]
    smr, niah, mtv, rps, gsi, dib, _ = b.load_heritage()
    freeze(sys.argv[2], make_ctx(areas, smr, niah, mtv, rps, gsi, dib, b.load_census()))
