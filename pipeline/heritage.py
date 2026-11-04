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
  * Every thread carries the id of the record it came from (smr:<SMRS>, niah:<REG_NO>).
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
    first = (s or "").split(",")[0]
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
    }


def select_threads(smr_records, niah_records, limit=8, per_group=1):
    """Rank candidate threads; at most `per_group` per SMR complex / NIAH name; drop score 0."""
    cands = [smr_thread(r) for r in smr_records if smr_score(r) > 0]
    cands += [niah_thread(r) for r in niah_records if niah_score(r) > 0]
    cands.sort(key=lambda t: (-t["score"], t["id"]))
    seen, out = {}, []
    for t in cands:
        if seen.get(t["group"], 0) >= per_group:
            continue
        seen[t["group"]] = seen.get(t["group"], 0) + 1
        out.append({k: v for k, v in t.items() if k not in ("score", "group")})
        if len(out) >= limit:
            break
    return out
