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


# --- Monuments to Visit + conflict rule (2026-11-04) -------------------------------------------------
SMR_MAYNOOTH = {"SMRS": "KD005-015----", "MONUMENT_CLASS": "Castle - Anglo-Norman masonry castle",
                "TOWNLAND": "MAYNOOTH", "WEBSITE_LINK": "x",
                "WEB_NOTES": "National Monument No. 485. The Manor of Maynooth was granted by Strongbow to Maurice "
                             "Fitzgerald who erected Maynooth castle, probably in the late-1180s. At the beginning of "
                             "the 14th century, the castle became principal residence of Kildare Geraldines."}
MTV_MAYNOOTH = {"ENTITY_ID": "KD00113", "SMRS": "KD005-015----", "NAME": "Maynooth Castle, County Kildare",
                "MONUMENT_CLASS": "Castle - Anglo-Norman masonry castle", "external_link": "https://heritageireland.ie/x",
                "MonumentsToVisit_INFO": "This great stone castle was founded in the early 13th century and became "
                    "the principal residence of the Kildare branch of the Geraldines. The original Keep, constructed "
                    "c. 1203, was one of the largest of its kind in Ireland.  Please note that many of these monuments "
                    "may be on private land and may not be publicly accessible. When setting out to visit monuments "
                    "please ensure that you wear appropriate footwear and clothing."}


def test_conflicting_sources_are_attributed_separately_never_merged():
    [t] = select_threads([SMR_MAYNOOTH], [], mtv_records=[MTV_MAYNOOTH])
    spoken = t["spokenNarrative"]
    smr_part, _, mtv_part = spoken.partition("The National Monuments Service's Monuments to Visit guide says:")
    assert smr_part.startswith("From the National Monuments Service record for this castle:")
    assert "late-1180s" in smr_part and "13th century" not in smr_part
    assert "early 13th century" in mtv_part and "1180s" not in mtv_part
    assert t["sourceIds"] == ["smr:KD005-015----", "nms-mtv:KD00113"]
    assert t["sources"] == ["nms-smr", "nms-mtv"]


def test_mtv_access_disclaimer_dropped():
    [t] = select_threads([SMR_MAYNOOTH], [], mtv_records=[MTV_MAYNOOTH])
    assert "private land" not in t["spokenNarrative"] and "footwear" not in t["detailMarkdown"]


def test_mtv_without_smr_candidate_is_its_own_thread():
    [t] = select_threads([], [], mtv_records=[MTV_MAYNOOTH])
    assert t["title"] == "Maynooth Castle"
    assert t["spokenNarrative"].startswith("From the National Monuments Service's Monuments to Visit guide, on Maynooth Castle:")
    assert t["sourceIds"] == ["nms-mtv:KD00113"]


NIAH_REC = {"REG_NO": 11803001, "NAME": "Carton House", "RATING": "National", "APPRAISAL": "A fine house.",
            "ORIGINAL_TYPE": "country house", "WEBSITE_LINK": "https://www.buildingsofireland.ie/niah/x",
            "IMAGE_LINK": "https://www.buildingsofireland.ie/building-images-iiif/niah/images/x.jpg"}


def test_niah_image_exact_join_with_credit():
    [t] = select_threads([], [NIAH_REC])
    img = t["image"]
    assert img["url"] == NIAH_REC["IMAGE_LINK"] and img["sourceUrl"] == NIAH_REC["WEBSITE_LINK"]
    assert img["credit"] and img["licence"] and img["sourceId"] == "niah-images"


def test_images_switch_and_untrusted_hosts():
    [t] = select_threads([], [NIAH_REC], images=False)
    assert "image" not in t
    [t] = select_threads([], [dict(NIAH_REC, IMAGE_LINK="https://example.com/x.jpg")])
    assert "image" not in t


# --- Records of Protected Structures (2026-11-04) ------------------------------------------------
from heritage import rps_eligible, rps_thread

RPS = {"council": "Kildare County Council", "councilKey": "kcc", "rpsNo": "B11-127", "name": "Louisa's Bridge",
       "descr": "Canal Bridge", "niahNo": None, "smrNo": None, "lat": 53.37, "lng": -6.5, "url": "u"}


def test_rps_thread_wording_is_the_councils():
    t = rps_thread(RPS)
    assert t["spokenNarrative"] == ("Kildare County Council's Record of Protected Structures lists Louisa's Bridge, "
                                    "recorded as: canal bridge.")
    assert t["sourceIds"] == ["rps:kcc:B11-127"] and t["sources"] == ["rps-kcc"]


def test_rps_skips_homes_and_items_already_covered():
    assert rps_eligible(RPS)
    assert not rps_eligible(dict(RPS, descr="Two Storey House Terrace"))   # private homes are never narrated
    assert not rps_eligible(dict(RPS, descr="Shop"))
    assert not rps_eligible(dict(RPS, niahNo=11803101))                    # NIAH covers it
    assert not rps_eligible(dict(RPS, smrNo="KD011-040"))                  # SMR covers it
    assert not rps_eligible(RPS, niah_points=[(53.37005, -6.5)])           # NIAH building within 25 m


def test_rps_drops_record_of_monuments_marker():
    t = rps_thread(dict(RPS, councilKey="sdcc", council="South Dublin County Council",
                        name="Lucan Weir", descr="Weir, Salmon Pass, Sluice Gates & Fishery Site (RM)"))
    assert "(RM)" not in t["spokenNarrative"] and t["spokenNarrative"].endswith("fishery site.")


def test_gsi_thread_is_verbatim_and_skips_name_only_summary():
    from heritage import gsi_thread
    t = gsi_thread({"SITECODE": "KE017", "SITENAME": "Louisa Bridge Warm Spring", "DESIGNAT": "CGS", "REPORT": "r",
                    "DESCRIPT": "A warm spring formerly used as a spa", "GEOLOGICAL": "Louisa Bridge warm spring"})
    assert t["spokenNarrative"] == ("From Geological Survey Ireland, on the Louisa Bridge Warm Spring County "
                                    "Geological Site: A warm spring formerly used as a spa.")
    assert t["sourceIds"] == ["gsi:KE017"] and t["category"] == "geology"


def test_rps_no_repetition_when_name_equals_description():
    t = rps_thread(dict(RPS, name="Lime Kiln", descr="Lime Kiln"))
    assert t["spokenNarrative"] == "Kildare County Council's Record of Protected Structures lists Lime Kiln."


# --- Dictionary of Irish Biography (2026-11-04) -------------------------------------------------
from heritage import dib_spoken, dib_thread

DIB_P = ("Ó Buachalla (Ua Buachalla), Domhnall (Donal/Daniel Richard Buckley) (1866–1963), republican and last "
         "governor general of the Irish Free State, was born 3 February 1866 in Maynooth, Co. Kildare, one of four "
         "sons and a daughter of Cornelius Buckley, shopkeeper and native Irish-speaker from Co. Kerry, and Sarah "
         "Buckley (née Jacob), whose father, Joshua Jacob (qv), was the founder of a sect.")


def test_dib_spoken_mechanical_edits_and_birthplace_cut():
    assert dib_spoken(DIB_P, "Maynooth") == (
        "Ó Buachalla, Domhnall (1866–1963), republican and last governor general of the Irish Free State, "
        "was born 3 February 1866 in Maynooth, County Kildare.")


def test_dib_says_nothing_unless_its_own_text_confirms_the_birthplace():
    assert dib_spoken(DIB_P, "Leixlip") is None   # Wikidata link not confirmed by DIB -> silent


def test_dib_thread_credits_author_and_licence():
    t = dib_thread({"dibId": "006284", "wikidata": "Q727370", "town": "Maynooth", "contributor": "Marie Coleman",
                    "title": "Ó Buachalla (Ua Buachalla), Domhnall (Donal/Daniel Richard Buckley)",
                    "firstParagraph": DIB_P, "url": "https://www.dib.ie/biography/x-a6284",
                    "doi": "https://doi.org/10.3318/dib.006284.v1"})
    assert t["spokenNarrative"].startswith("From the Dictionary of Irish Biography, by Marie Coleman: Ó Buachalla")
    assert t["sourceIds"] == ["dib:006284", "wikidata:Q727370"] and "CC BY-NC 4.0" in t["detailMarkdown"]


def test_commons_photo_is_preferred_and_survives_the_non_commercial_switch():
    commons = [{"smr": "KD005-015----", "niah": None, "thumb": "https://upload.wikimedia.org/x.jpg",
                "page": "https://commons.wikimedia.org/wiki/File:x.jpg", "licence": "CC BY-SA 3.0", "artist": "A. Person"}]
    [t] = select_threads([SMR_MAYNOOTH], [], commons_records=commons, images=False)
    assert t["image"]["credit"] == "Photo: A. Person, via Wikimedia Commons"
    assert t["image"]["licence"] == "CC BY-SA 3.0" and t["image"]["sourceId"] == "commons"
    commons[0]["thumb"] = "https://example.com/x.jpg"
    [t] = select_threads([SMR_MAYNOOTH], [], commons_records=commons)
    assert "image" not in t
