"""Integrity tests on the BUILT area files the app ships (public/data/areas/*.json)."""
import json, re
from pathlib import Path
import h3
import pytest

FILES = sorted((Path(__file__).resolve().parent.parent / "public" / "data" / "areas").glob("*.json"))
FILES = [f for f in FILES if f.name != "index.json"]


@pytest.fixture(params=FILES, ids=lambda f: f.stem)
def doc(request):
    return json.loads(request.param.read_text())


def test_files_exist():
    assert FILES, "run build_areas.py first"


def test_every_cell_maps_to_an_existing_area(doc):
    assert doc["cells"]
    for cell, area in doc["cells"].items():
        assert h3.get_resolution(cell) == doc["h3Resolution"] == 8
        assert area in doc["areas"]


def test_every_sentence_is_sourced(doc):
    for a in doc["areas"].values():
        assert a["sentences"], a["id"]
        for s in a["sentences"]:
            assert s["sourceIds"], (a["id"], s["text"])
        assert a["teaser"] == " ".join(s["text"] for s in a["sentences"])


def test_every_area_source_is_registered_with_licence(doc):
    for a in doc["areas"].values():
        for src in a["sources"]:
            reg = doc["sources"][src]
            assert reg["licence"] and reg["attribution"]


def test_irish_name_only_spoken_when_present_as_validated(doc):
    for a in doc["areas"].values():
        if not a.get("nameGa"):
            assert "In Irish," not in a["teaser"]


def test_heritage_threads_are_sourced_and_attributed(doc):
    for a in doc["areas"].values():
        for t in a.get("threads", []):
            assert t["sourceIds"] and all(x.startswith(("smr:", "niah:", "nms-mtv:", "rps:", "gsi:", "dib:", "wikidata:")) for x in t["sourceIds"])
            if t["id"].startswith("story-"):
                # summarised stories: references on screen only, never spoken; fact-checked at build time
                assert t["detailMarkdown"].startswith("Sources (adapted, not quoted)"), t["id"]
                assert a.get("storyStatus") in ("draft", "approved"), t["id"]
                assert not re.search(r"\b(From the National|Record of Protected Structures|Geological Survey Ireland)\b",
                                     t["spokenNarrative"]), t["id"]
                continue
            assert t["spokenNarrative"].startswith(("From the National", "From Geological Survey Ireland",
                                                    "From the Dictionary of Irish Biography, by ",
                                                    "Kildare County Council's Record",
                                                    "South Dublin County Council's Record"))
            for src in t["sources"]:
                reg = doc["sources"][src]
                assert src in a["sources"]
                # CC BY 4.0, or a non-commercial-only source logged in SOURCES.md
                assert reg["licence"] == "CC BY 4.0" or (reg.get("nonCommercialOnly") and src in (
                    Path(__file__).resolve().parent.parent / "SOURCES.md").read_text()), src


def test_no_cell_belongs_to_two_county_files():
    seen = {}
    for f in FILES:
        for cell in json.loads(f.read_text())["cells"]:
            assert cell not in seen, f"{cell} in both {seen.get(cell)} and {f.stem}"
            seen[cell] = f.stem


def test_census_sentences_only_for_cso_towns(doc):
    for a in doc["areas"].values():
        for s in a["sentences"]:
            if any(i.startswith("cso:") for i in s["sourceIds"]):
                assert a["kind"] == "town" and a.get("urbanAreaGuid") and "cso-census" in a["sources"]


def test_multi_source_threads_attribute_each_source(doc):
    """Conflict rule: a second source is a separate, attributed passage."""
    for a in doc["areas"].values():
        for t in a.get("threads", []):
            if "nms-mtv" in t["sources"] and not t["id"].startswith("story-"):
                assert "Monuments to Visit guide" in t["spokenNarrative"], t["id"]
                assert any(s.startswith("nms-mtv:") for s in t["sourceIds"]), t["id"]


def test_images_are_exact_join_credited_and_flagged(doc):
    repo = Path(__file__).resolve().parent.parent
    readme = (repo / "SOURCES.md").read_text()
    for a in doc["areas"].values():
        for t in a.get("threads", []):
            img = t.get("image")
            if not img:
                continue
            assert img["url"].startswith(("https://www.buildingsofireland.ie/", "https://upload.wikimedia.org/",
                                          "https://thumb.wikimedia.org/")), t["id"]
            assert img["credit"] and img["licence"] and img["sourceUrl"], t["id"]
            reg = doc["sources"][img["sourceId"]]
            assert img["sourceId"] in a["sources"], t["id"]
            if reg.get("nonCommercialOnly"):
                assert img["sourceId"] in readme, f"{img['sourceId']} must be logged in SOURCES.md licensing decisions"


def test_crossing_features_are_sourced_and_cells_belong_to_this_county(doc):
    feats, fcells = doc.get("features", {}), doc.get("featureCells", {})
    for fid, f in feats.items():
        assert f["spoken"].startswith("You're "), fid
        assert f["sourceIds"] and all(s in doc["sources"] for s in f["sources"]), fid
    for cell, entries in fcells.items():
        assert cell in doc["cells"], cell
        for fid, coords in entries:
            assert fid in feats and len(coords) >= 4 and len(coords) % 2 == 0


def test_only_reviewed_river_names_are_spoken(doc):
    approved = {r["epaName"] for r in json.loads((Path(__file__).resolve().parent / "review" / "rivers.json").read_text())["rivers"]
                if r.get("approved")}
    for f in doc.get("features", {}).values():
        if f["kind"] == "river":
            assert f["name"] in approved, f["name"]


def test_bridges_are_named_sourced_and_in_this_county(doc):
    for cell, pts in doc.get("bridges", {}).items():
        assert cell in doc["cells"]
        for lng, lat, name, sid in pts:
            assert "ridge" in name or "queduct" in name or "quaduct" in name or "iaduct" in name, name
            assert sid.startswith(("niah:", "rps:")), sid
