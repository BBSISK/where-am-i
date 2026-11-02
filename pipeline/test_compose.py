from compose import compose, teaser_text

def rec(id, en, ga=None, ga_validated=True, cat="B", glossary=(), parish=None):
    names = [{"language": "en", "wording": en, "main": True}]
    if ga:
        names.append({"language": "ga", "wording": ga, "main": True,
                      "acceptability": {"id": 9 if ga_validated else 10}})
    inc = [{"nameEN": parish, "category": {"id": "PAR"}}] if parish else []
    return {"id": id, "placenames": names, "categories": [{"id": cat}], "includedIn": inc,
            "glossary": [{"id": i, "headword": h, "translation": t} for i, (h, t) in enumerate(glossary, 1)]}

def test_validated_town_with_glossary():
    s = compose(rec(1416490, "Leixlip", "Léim an Bhradáin", glossary=[("léim", "leap")]))
    assert teaser_text(s) == ("Leixlip, a town. In Irish, Léim an Bhradáin. "
                              "Logainm lists this element in the name: léim, meaning “leap”.")

def test_two_glossary_elements():
    s = compose(rec(25290, "Celbridge", "Cill Droichid", glossary=[("cill", "church"), ("droichead", "bridge")]))
    assert "cill, meaning “church” and droichead, meaning “bridge”" in teaser_text(s)

def test_unvalidated_irish_is_never_spoken():
    s = compose(rec(24838, "Martinstown", "Baile Mháirtín", ga_validated=False, cat="BF",
                    glossary=[("baile", "townland")], parish="Kilcullen"))
    assert teaser_text(s) == "Martinstown, a townland in the civil parish of Kilcullen."
    assert "Baile" not in teaser_text(s)

def test_validated_without_glossary():
    s = compose(rec(17131, "Lucan", "Leamhcán"))
    assert teaser_text(s) == "Lucan, a town. In Irish, Leamhcán."

def test_every_sentence_is_sourced():
    for r in [rec(1, "A", "B", glossary=[("x", "y")]), rec(2, "C", cat="BF", parish="P")]:
        for s in compose(r):
            assert s.source_ids and all(i.startswith("logainm") for i in s.source_ids)

def test_glossary_sentence_cites_glossary_entries():
    s = compose(rec(5, "Celbridge", "Cill Droichid", glossary=[("cill", "church"), ("droichead", "bridge")]))
    assert s[-1].source_ids == ["logainm:5", "logainm-glossary:1", "logainm-glossary:2"]

def test_no_name_no_teaser():
    assert compose({"id": 9, "placenames": [], "categories": []}) == []
