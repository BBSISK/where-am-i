"""Integrity tests on the BUILT area files the app ships (public/data/areas/*.json)."""
import json
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
