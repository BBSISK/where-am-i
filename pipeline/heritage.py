"""
Turn National Monuments Service (SMR) and NIAH records into "Tell me more" threads.

Rigour rules:
  * Spoken text is the official record's OWN wording. No summarising, no generated prose.
  * Only these mechanical edits are allowed (all tested):
      - drop the "Compiled by / Date of upload" footer,
      - drop parenthetical bibliographic references, record codes and measurements,
      - "c. 1780" -> "circa 1780",
      - compass shorthand ("S bank", "c. 160m to the ENE") -> words,
      - collapse whitespace.
  * Every thread carries the id of the record it came from (smr:<SMRS>, niah:<REG_NO>, nms-mtv:<ENTITY_ID>).
  * CONFLICT RULE: when two sources describe the same thing (e.g. the SMR record and the Monuments to
    Visit guide for Maynooth Castle, which date the castle differently), each source is spoken as its
    own passage, introduced by its own attribution. Texts are never merged or reconciled.
  * Images: at most one per thread, only from an exact record join (NIAH IMAGE_LINK by REG_NO), always
    with credit, licence note and a link to the record. No image is better than a guessed image.
"""
import re

COMPASS = {
    "N": "north", "S": "south", "E": "east", "W": "west",
    "NE": "north-east", "NW": "north-west", "SE": "south-east", "SW": "south-west",
    "NNE": "north-north-east", "ENE": "east-north-east", "ESE": "east-south-east", "SSE": "south-south-east",
    "SSW": "south-south-west", "WSW": "west-south-west", "WNW": "west-north-west", "NNW": "north-north-west",
}
ABBREV = {"c", "st", "no", "co", "nos", "approx", "ft", "mr", "dr", "i.e", "e.g", "etc", "fig", "pl"}

KEY_SMR_CLASSES = ("castle", "church", "abbey", "friary", "priory", "bridge", "tower house", "holy well",
                   "mill", "cathedral", "round tower", "high cross", "ringfort", "motte", "historic town")

REF_PAREN = re.compile(
    r"\s*\((?:[^()]*?(?:\b1[5-9]\d\d[a-z]?\b|\b20\d\d[a-z]?\b|[A-Z]{2}\d{3}-[\dA-Z-]+|\d+(?:\.\d+)?\s?m\b)[^()]*?)\)")
CODE_INLINE = re.compile(r"\b[A-Z]{2}\d{3}-\d{3}[\d-]*\b")


def clean(text):
    if not text:
        return ""
    t = re.split(r"\n\s*Compiled by:", text)[0]
    t = re.split(r"\n\s*Date of upload", t)[0]
    t = REF_PAREN.sub("", t)
    t = re.sub(r"\(\s*\)", "", t)
    t = re.sub(r"\bc\.\s*(?=\d)", "circa ", t)
    # compass shorthand only: not initials ("W.M. Mitchell"), road numbers ("N4") or codes
    t = re.sub(r"(?<![.\w])(NNE|ENE|ESE|SSE|SSW|WSW|WNW|NNW|NE|NW|SE|SW|N|S|E|W)\b(?![\d'’.-])",
               lambda m: COMPASS[m.group(1)], t)
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"\s+([,.;:])", r"\1", t)
    return t


def sentences(text):
    """Split into sentences without breaking after common abbreviations or initials."""
    out, start = [], 0
    for m in re.finditer(r"\.\s+(?=[A-Z])", text):
        before = text[start:m.start()].split()
        last = before[-1].lower().rstrip(".") if before else ""
        if last in ABBREV or (len(last) == 1 and last.isalpha()):
            continue
        out.append(text[start:m.start() + 1].strip())
        start = m.end()
    tail = text[start:].strip()
    if tail:
        out.append(tail)
    return out


def first_sentences(text, max_sentences=3, max_words=90):
    picked, words = [], 0
    for s in sentences(text):
        n = len(s.split())
        if picked and (len(picked) >= max_sentences or words + n > max_words):
            break
        picked.append(s)
        words += n
    return " ".join(picked)


MTV_DISCLAIMER = re.compile(r"\s*Please note that many of these monuments may be on private land.*$", re.S)
NIAH_IMAGE_PREFIX = "https://www.buildingsofireland.ie/"


def mtv_clean(text):
    """Monuments to Visit text, minus the standard access disclaimer appended to every entry."""
    return clean(MTV_DISCLAIMER.sub("", text or ""))


def mtv_passage(r):
    return "The National Monuments Service's Monuments to Visit guide says: " + first_sentences(
        mtv_clean(r["MonumentsToVisit_INFO"]), max_sentences=3, max_words=80)


def mtv_detail(r):
    return (f"\n\n**Monuments to Visit** ({r['NAME']}): {mtv_clean(r['MonumentsToVisit_INFO'])}\n\n"
            f"[Visitor information]({r.get('external_link') or r.get('WEBSITE_LINK')}). Source: Monuments to Visit, "
            f"National Monuments Service, Department of Housing, Local Government and Heritage (CC BY 4.0).")


def add_mtv(thread, r):
    """Attach a Monuments to Visit passage to an SMR thread. Separate, attributed: never merged (conflict rule)."""
    t = dict(thread)
    t["spokenNarrative"] = f"{thread['spokenNarrative']} {mtv_passage(r)}"
    t["detailMarkdown"] = thread["detailMarkdown"] + mtv_detail(r)
    t["sourceIds"] = thread["sourceIds"] + [f"nms-mtv:{r['ENTITY_ID']}"]
    t["sources"] = thread["sources"] + ["nms-mtv"]
    t["score"] = max(thread.get("score", 0), 95) + 10
    return t


def mtv_thread(r):
    name = re.sub(r",\s*(County|Co\.)\s+\w+$", "", r["NAME"]).strip()
    spoken = first_sentences(mtv_clean(r["MonumentsToVisit_INFO"]), max_sentences=3, max_words=80)
    return {
        "id": f"mtv-{r['ENTITY_ID']}", "category": "monument", "title": name,
        "hookSnippet": sentences(spoken)[0] if spoken else name,
        "spokenNarrative": f"From the National Monuments Service's Monuments to Visit guide, on {name}: {spoken}",
        "detailMarkdown": f"**{name}** ({r.get('MONUMENT_CLASS')}). Record {r.get('SMRS')}." + mtv_detail(r),
        "sourceIds": [f"nms-mtv:{r['ENTITY_ID']}"], "sources": ["nms-mtv"], "score": 105,
        "group": (r.get("SMRS") or r["ENTITY_ID"])[:10],
    }


def niah_image(r):
    url = r.get("IMAGE_LINK") or ""
    if not url.startswith(NIAH_IMAGE_PREFIX):
        return None
    return {"url": url, "alt": f"Photograph of {r['NAME']} from the National Inventory of Architectural Heritage",
            "credit": "Photo: National Inventory of Architectural Heritage",
            "licence": "NIAH terms: non-commercial use with credit",
            "sourceUrl": r.get("WEBSITE_LINK"), "sourceId": "niah-images"}


# RPS: only structures that are not homes, shops or offices (no narrating private addresses), and only
# where NIAH / SMR do not already cover them (exact cross-reference numbers; for South Dublin, which has
# none, an NIAH building within 25 m suppresses the RPS entry; suppression only, never a claim).
RPS_EXCLUDE = re.compile(r"house|cottage|dwelling|lodge|terrace|residence|apartment|flat|shop|office|"
                         r"garda|outbuilding|barn|stable|coach|railings|walls?\b|gate|piers?\b|building", re.I)


def rps_eligible(r, niah_points=()):
    descr = (r.get("descr") or "").strip()
    if not descr or not r.get("name") or RPS_EXCLUDE.search(descr):
        return False
    if r.get("niahNo") or r.get("smrNo"):
        return False
    import math
    for lat, lng in niah_points:
        dy = (r["lat"] - lat) * 111320
        dx = (r["lng"] - lng) * 111320 * math.cos(math.radians(lat))
        if dx * dx + dy * dy < 25 * 25:
            return False
    return True


def rps_thread(r):
    name = re.sub(r",\s*Co\.?\s+\w+$", "", r["name"].strip())
    descr = re.sub(r"\s*\(RM\)", "", r["descr"].strip())  # "(RM)" = also in the Record of Monuments
    d = descr.lower()
    spoken = (f"{r['council']}'s Record of Protected Structures lists {name}."
              if d == name.lower() else
              f"{r['council']}'s Record of Protected Structures lists {name}, recorded as: {d}.")
    return {
        "id": f"rps-{r['councilKey']}-{r['rpsNo']}", "category": "architecture", "title": name,
        "hookSnippet": f"A protected structure: {d}.",
        "spokenNarrative": spoken,
        "detailMarkdown": f"**{name}**: {descr}. {r['council']} Record of Protected Structures no. {r['rpsNo']}.\n\n"
                          f"[Source dataset]({r['url']}). Contains Irish Public Sector Data licensed under CC BY 4.0.",
        "sourceIds": [f"rps:{r['councilKey']}:{r['rpsNo']}"], "sources": [f"rps-{r['councilKey']}"], "score": 40,
        "group": f"rps:{name.lower()}",
    }


def gsi_thread(r):
    """GSI County Geological Site: its own one-line description and geological summary, verbatim."""
    name = r["SITENAME"].strip()
    parts = [p.strip().rstrip(".") for p in (r.get("DESCRIPT"), r.get("GEOLOGICAL")) if p and p.strip()]
    # skip a summary that only repeats the site name (e.g. "Louisa Bridge warm spring")
    parts = [p for i, p in enumerate(parts) if not (i and p.lower() == name.lower())]
    body = ". ".join(p[0].upper() + p[1:] for p in parts) + "."
    return {
        "id": f"gsi-{r['SITECODE']}", "category": "geology", "title": name,
        "hookSnippet": parts[0][0].upper() + parts[0][1:] + "." if parts else name,
        "spokenNarrative": f"From Geological Survey Ireland, on the {name} County Geological Site: {body}",
        "detailMarkdown": f"**{name}** (County Geological Site {r['SITECODE']}; {r.get('DESIGNAT')}).\n\n{body}\n\n"
                          f"[Site report (PDF)]({r.get('REPORT')}). Source: Geological Survey Ireland (CC BY 4.0).",
        "sourceIds": [f"gsi:{r['SITECODE']}"], "sources": ["gsi"], "score": 65,
        "group": f"gsi:{r['SITECODE']}",
    }


def smr_score(r):
    notes = r.get("WEB_NOTES") or ""
    cls = (r.get("MONUMENT_CLASS") or "").lower()
    if "redundant" in cls or not notes.strip():
        return 0
    if "National Monument" in notes:
        return 100
    if any(k in cls for k in KEY_SMR_CLASSES):
        return 60
    return 0


def niah_score(r):
    """v1 (testbed): only buildings NIAH rates of NATIONAL importance, with a name and an appraisal."""
    if not (r.get("APPRAISAL") or "").strip() or not r.get("NAME"):
        return 0
    return 90 if r.get("RATING") == "National" else 0


GENERIC_MAIN = {"Ritual site", "Habitation site", "Water mill", "House"}


def title_case(s):
    first = re.sub(r"\s*\(.*?\)", "", (s or "").split(",")[0])
    return " ".join(w.capitalize() for w in first.split())


def smr_kind(cls):
    main, _, sub = cls.partition(" - ")
    return sub[0].upper() + sub[1:] if main in GENERIC_MAIN and sub else main


def smr_thread(r):
    smrs = r["SMRS"]
    cls = r["MONUMENT_CLASS"]
    place = title_case(r.get("TOWNLAND"))
    body = clean(r["WEB_NOTES"])
    spoken = first_sentences(body)
    kind = smr_kind(cls)
    title = f"{kind} in {place}" if place else kind
    return {
        "id": f"smr-{smrs.strip('-')}", "category": "monument", "title": title,
        "hookSnippet": sentences(spoken)[0] if spoken else title,
        "spokenNarrative": f"From the National Monuments Service record for this {kind.lower()}: {spoken}",
        "detailMarkdown": f"**{cls}**, {place}. Record {smrs}.\n\n{body}\n\n"
                          f"[View the official record]({r.get('WEBSITE_LINK')}). Source: National Monuments Service, "
                          f"Department of Housing, Local Government and Heritage (CC BY 4.0).",
        "sourceIds": [f"smr:{smrs}"], "sources": ["nms-smr"], "score": smr_score(r),
        "group": smrs[:10],
    }


def niah_thread(r):
    reg = r["REG_NO"]
    name = r["NAME"]
    body = clean(r["APPRAISAL"])
    spoken = first_sentences(body)
    dates = f"{r['DATEFROM']}–{r['DATETO']}" if r.get("DATEFROM") and r.get("DATETO") else ""
    return {
        "id": f"niah-{reg}", "category": "architecture", "title": name,
        "hookSnippet": sentences(spoken)[0] if spoken else name,
        "spokenNarrative": f"From the National Inventory of Architectural Heritage, on {name}: {spoken}",
        "detailMarkdown": f"**{name}** ({r.get('ORIGINAL_TYPE')}{', ' + dates if dates else ''}; rated {r.get('RATING')}). "
                          f"Reg. no. {reg}.\n\n{body}\n\n[View the official record]({r.get('WEBSITE_LINK')}). "
                          f"Source: National Inventory of Architectural Heritage, Department of Housing, "
                          f"Local Government and Heritage (CC BY 4.0).",
        "sourceIds": [f"niah:{reg}"], "sources": ["niah"], "score": niah_score(r),
        "group": f"niah-name:{name.lower()}",
        "image": niah_image(r),
    }


def select_threads(smr_records, niah_records, limit=8, per_group=1, mtv_records=(), images=True, rps_records=(),
                   gsi_records=()):
    """Rank candidate threads; at most `per_group` per SMR complex / NIAH name; drop score 0.
    A Monuments to Visit entry joins its SMR record exactly (SMRS) and is added as a separate passage;
    with no SMR candidate it becomes its own thread. `images=False` strips non-commercial-only images."""
    mtv_by_smrs = {r["SMRS"]: r for r in mtv_records if r.get("SMRS") and r.get("MonumentsToVisit_INFO")}
    cands, used_mtv = [], set()
    for r in smr_records:
        m = mtv_by_smrs.get(r["SMRS"])
        if smr_score(r) > 0 or (m and (r.get("WEB_NOTES") or "").strip()):
            t = smr_thread(r)
            if m:
                t = add_mtv(t, m)
                used_mtv.add(r["SMRS"])
            cands.append(t)
    cands += [mtv_thread(m) for k, m in mtv_by_smrs.items() if k not in used_mtv]
    cands += [niah_thread(r) for r in niah_records if niah_score(r) > 0]
    niah_points = [(r["LATITUDE"], r["LONGITUDE"]) for r in niah_records if r.get("LATITUDE") is not None]
    cands += [rps_thread(r) for r in rps_records if rps_eligible(r, niah_points)]
    cands += [gsi_thread(r) for r in gsi_records if r.get("SITENAME") and (r.get("DESCRIPT") or r.get("GEOLOGICAL"))]
    cands.sort(key=lambda t: (-t["score"], t["id"]))
    seen, out = {}, []
    for t in cands:
        if seen.get(t["group"], 0) >= per_group:
            continue
        seen[t["group"]] = seen.get(t["group"], 0) + 1
        t = {k: v for k, v in t.items() if k not in ("score", "group") and not (k == "image" and (v is None or not images))}
        out.append(t)
        if len(out) >= limit:
            break
    return out
