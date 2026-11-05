import json
from pathlib import Path
import pytest
from stories import fact_check, norm, check_item, digest, source_text, apply_stories, make_ctx

SRC = ("National Monument No. 485. The Manor of Maynooth was granted by Strongbow to Maurice Fitzgerald who "
       "erected Maynooth castle, probably in the late-1180s. Built 1845-51. Seven main phases. "
       "According to the OSL Archdall records the death of the First Earl of Kildare at Laraghbryan in AD 1316.")


def test_passes_when_every_number_and_name_is_in_the_sources():
    assert fact_check("Strongbow granted the manor to Maurice Fitzgerald; the castle went up in the late 1180s, "
                      "and there were seven main phases. The First Earl died at Laraghbryan in 1316.", SRC) == []


def test_invented_year_or_name_fails():
    assert "number 1190 not in sources" in fact_check("It was built in 1190.", SRC)
    assert "name 'Cromwell' not in sources" in fact_check("Strongbow met Cromwell here.", SRC)


def test_number_words_ordinals_and_year_ranges_are_normalised():
    assert "1851" in norm("1845-51") and "7" in norm("Seven") and "18th" in norm("eighteenth")
    assert fact_check("Between 1845 and 1851.", SRC) == []


def _ctx(text="Ivy-clad church. Built 1248."):
    return {"smr": {"KD1": {"SMRS": "KD1", "MONUMENT_CLASS": "Church", "TOWNLAND": "X", "WEB_NOTES": text}}}


def test_changed_source_blocks_the_story_until_refrozen():
    item = {"text": "Built in 1248.", "sourceIds": ["smr:KD1"]}
    frozen = {"smr:KD1": digest(source_text("smr:KD1", _ctx()))}
    assert check_item(item, _ctx(), frozen) == (True, "ok")
    ok, why = check_item(item, _ctx("Ivy-clad church. Built 1250."), frozen)
    assert not ok and "changed since the story was written" in why


def test_apply_replaces_threads_and_teaser_and_puts_references_on_screen(tmp_path):
    ctx = make_ctx({"t": {"logainmId": 1, "name": "Town", "nameGa": "Baile", "kind": "town"}},
                   smr=[{"SMRS": "KD1", "MONUMENT_CLASS": "Church", "TOWNLAND": "X", "WEB_NOTES": "Built 1248."}])
    story = {"id": "c", "title": "Old church", "text": "This church was built in 1248.", "sourceIds": ["smr:KD1"]}
    teaser = {"text": "Welcome to Town, Baile in Irish.", "sourceIds": ["logainm:1"]}
    doc = {"areaId": "t", "county": "k", "status": "draft", "teaser": teaser, "stories": [story],
           "sourceHashes": {sid: digest(source_text(sid, ctx)) for sid in ["smr:KD1", "logainm:1"]}}
    (tmp_path / "town.json").write_text(json.dumps(doc))
    areas = {"t": {"logainmId": 1, "name": "Town", "nameGa": "Baile", "kind": "town", "teaser": "old",
                   "sentences": [], "sources": ["logainm"], "threads": [{"id": "smr-KD1", "sourceIds": ["smr:KD1"],
                                                                          "title": "Church", "sources": ["nms-smr"]}]}}
    rep = apply_stories(areas, "k", ctx, tmp_path)
    a = areas["t"]
    assert all(r["ok"] for r in rep) and a["teaser"] == teaser["text"] and a["storyStatus"] == "draft"
    [t] = a["threads"]
    assert t["id"] == "story-c" and t["spokenNarrative"] == story["text"]
    assert t["detailMarkdown"].startswith("Sources (adapted, not quoted)") and "smr:KD1" in t["detailMarkdown"]


def test_real_story_files_pass_the_fact_check_when_caches_are_present():
    here = Path(__file__).resolve().parent
    if not (here / "cache" / "heritage" / "kildare_smr.json").exists():
        pytest.skip("source caches not present (they are in the Build area data workflow)")
    import build_areas as b
    smr, niah, mtv, rps, gsi, dib, commons = b.load_heritage()
    for f in (here / "review" / "stories").glob("*.json"):
        doc = json.loads(f.read_text())
        areas = json.loads((here.parent / "public" / "data" / "areas" / f"{doc['county']}.json").read_text())["areas"]
        ctx = make_ctx(areas, smr, niah, mtv, rps, gsi, dib, b.load_census())
        for item in [doc["teaser"]] + doc["stories"]:
            assert check_item(item, ctx, doc["sourceHashes"]) == (True, "ok"), (f.name, item.get("id"))
