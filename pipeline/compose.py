"""
Turn ONE Logainm place record into an etymology teaser, sentence by sentence, each sentence carrying
the ids of the records it is built from. Nothing is added that the record does not state.

Tiers (agreed rules):
  1. (never: Logainm explanatory notes are © Government of Ireland, outside CC BY, and must not be
     reproduced, rephrased or summarised; Gaois, 2026-11-04. See SOURCES.md decision log.)
  2. Irish name is VALIDATED: say both names; name the glossary elements Logainm attaches to this record.
  3. Otherwise: English name (+ type / parish) only. Unvalidated Irish forms are never spoken.
"""
from dataclasses import dataclass, field

VALIDATED = 9  # Logainm acceptability id for "validated name"
TYPE_WORDS = {"BF": "a townland", "B": "a town"}


@dataclass
class Sentence:
    text: str
    source_ids: list = field(default_factory=list)


def _main_name(record, lang):
    names = [n for n in record.get("placenames", []) if n.get("language") == lang]
    main = [n for n in names if n.get("main")]
    return (main or names or [None])[0]


def validated_irish(record):
    for n in record.get("placenames", []):
        if n.get("language") == "ga" and (n.get("acceptability") or {}).get("id") == VALIDATED:
            return n["wording"]
    return None


def english_name(record):
    n = _main_name(record, "en")
    return n["wording"] if n else None


def parish(record):
    for u in record.get("includedIn", []):
        if (u.get("category") or {}).get("id") == "PAR":
            return u.get("nameEN")
    return None


def compose(record):
    rid = f"logainm:{record['id']}"
    en = english_name(record)
    ga = validated_irish(record)
    cat = next((c["id"] for c in record.get("categories", []) if c["id"] in TYPE_WORDS), None)
    out = []

    name = en or ga
    if not name:
        return []
    kind = TYPE_WORDS.get(cat)
    par = parish(record)
    first = name
    if kind and par and cat == "BF":
        first += f", {kind} in the civil parish of {par}"
    elif kind:
        first += f", {kind}"
    out.append(Sentence(first + ".", [rid]))

    if ga and en and ga != en:
        out.append(Sentence(f"In Irish, {ga}.", [rid]))
        gl = record.get("glossary") or []
        if gl:
            parts = [f"{g['headword']}, meaning “{g['translation']}”" for g in gl]
            joined = parts[0] if len(parts) == 1 else ", ".join(parts[:-1]) + " and " + parts[-1]
            out.append(Sentence(
                f"Logainm lists {'this element' if len(gl) == 1 else 'these elements'} in the name: {joined}.",
                [rid] + [f"logainm-glossary:{g['id']}" for g in gl]))
    return out


def teaser_text(sentences):
    return " ".join(s.text for s in sentences)
