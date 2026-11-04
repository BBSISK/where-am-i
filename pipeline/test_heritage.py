from heritage import clean, sentences, first_sentences, select_threads, smr_score, niah_score

def test_clean_strips_footer_refs_codes_measurements():
    raw = ("In the grounds of St Patricks College, Maynooth. The site of the Council House which formed part of "
           "the Maynooth castle (KD005-015----) complex and which was demolished c. 1780, according to the "
           "Fourth Duke of Leinster (1891-5, 321). A doorway (Wth 1.03m; H 2.4m) survives.\n\n"
           "Compiled by: Gearóid Conroy\n\nDate of upload: 10 June 2011")
    t = clean(raw)
    assert "Compiled by" not in t and "KD005" not in t and "1891-5" not in t and "1.03m" not in t
    assert "demolished circa 1780, according to the Fourth Duke of Leinster." in t

def test_compass_words():
    assert clean("Situated on the S bank, c. 160m to the ENE of the NE corner.") == \
        "Situated on the south bank, circa 160m to the east-north-east of the north-east corner."

def test_compass_does_not_touch_road_numbers_codes_or_initials():
    assert clean("Beside the N4 road.") == "Beside the N4 road."
    assert clean("A hotel designed by W.M. Mitchell.") == "A hotel designed by W.M. Mitchell."
    assert clean("Built by E. Smith on the W side.") == "Built by E. Smith on the west side."

def test_strips_lettered_year_references():
    assert clean("It was in good condition in 1615 (IHR 1941a, 47-8; IHS, 98).") == "It was in good condition in 1615."

def test_titles():
    from heritage import smr_thread
    t = smr_thread({"SMRS": "DU017-002001-", "MONUMENT_CLASS": "Ritual site - holy well", "WEB_NOTES": "Two wells.",
                    "TOWNLAND": "COLDBLOW,LUCAN DEMESNE", "WEBSITE_LINK": "x"})
    assert t["title"] == "Holy well in Coldblow"
    t2 = smr_thread({"SMRS": "KD011-1", "MONUMENT_CLASS": "Ritual site - holy well", "WEB_NOTES": "A well.",
                     "TOWNLAND": "NEWTOWN (LEIXLIP ED)", "WEBSITE_LINK": "x"})
    assert t2["title"] == "Holy well in Newtown"
    assert "for this holy well:" in t["spokenNarrative"]

def test_sentence_split_respects_abbreviations():
    s = sentences("St. Mary's Church incorporates parts of an earlier church. It was rebuilt c. 1770. Built by J. Smith.")
    assert s == ["St. Mary's Church incorporates parts of an earlier church.", "It was rebuilt c. 1770.", "Built by J. Smith."]

def test_first_sentences_limit():
    t = "One two. Three four. Five six. Seven eight."
    assert first_sentences(t, max_sentences=2) == "One two. Three four."

def smr(code, cls, notes, townland="MAYNOOTH"):
    return {"SMRS": code, "MONUMENT_CLASS": cls, "WEB_NOTES": notes, "TOWNLAND": townland, "WEBSITE_LINK": "https://x"}

def niah(reg, name, rating, appraisal="A fine building. It is important."):
    return {"REG_NO": reg, "NAME": name, "RATING": rating, "APPRAISAL": appraisal, "ORIGINAL_TYPE": "house",
            "DATEFROM": 1800, "DATETO": 1820, "WEBSITE_LINK": "https://y"}

def test_ranking_and_dedupe():
    S = [smr("KD005-015----", "Castle - Anglo-Norman masonry castle", "National Monument No. 485. The castle."),
         smr("KD005-016----", "Church", "St. Mary's Church."),
         smr("KD005-016001-", "Graveyard", "A graveyard."),          # not a key class -> dropped
         smr("KD005-099----", "Redundant record", "Nothing.")]
    N = [niah(11803113, "Saint Patrick's College", "National"),
         niah(11803127, "Saint Patrick's College", "National"),           # same name -> deduped
         niah(11803004, None, "Regional"),                                # no name -> dropped
         niah(11803005, "Leinster House", "Regional")]
    t = select_threads(S, N, limit=10)
    assert [x["id"] for x in t] == ["smr-KD005-015", "niah-11803113", "smr-KD005-016"]  # Regional dropped in v1

def test_every_thread_sourced_and_attributed():
    t = select_threads([smr("KD005-015----", "Castle - unclassified", "National Monument No. 1. A castle.")],
                       [niah(1, "X House", "National")])
    for x in t:
        assert x["sourceIds"] and x["sources"]
        assert x["spokenNarrative"].startswith("From the National")

def test_spoken_text_is_verbatim_after_cleaning():
    notes = "The Manor of Maynooth was granted by Strongbow to Maurice Fitzgerald (Ball 1906, 81). It became the principal residence."
    t = select_threads([smr("KD005-015----", "Castle - unclassified", "National Monument No. 485. " + notes)], [])[0]
    assert "The Manor of Maynooth was granted by Strongbow to Maurice Fitzgerald." in t["spokenNarrative"]
    assert "Ball 1906" not in t["spokenNarrative"]
