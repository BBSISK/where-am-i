"""Synthetic tests of the area rules in build_areas.build_doc (towns first; drive test 2026-11-03)."""
import h3
from shapely.geometry import box, mapping, Point
from build_areas import build_doc, cell_point, km


def town_rec(id, en, ga, lon, lat):
    return {"id": id, "categories": [{"id": "B"}], "permalink": f"https://www.logainm.ie/{id}.aspx",
            "placenames": [{"language": "en", "wording": en, "main": True},
                           {"language": "ga", "wording": ga, "main": True, "acceptability": {"id": 9}}],
            "geography": {"coordinates": [{"latitude": lat, "longitude": lon}]}, "glossary": [], "includedIn": []}


def townland_rec(id, en):
    return {"id": id, "categories": [{"id": "BF"}], "permalink": None,
            "placenames": [{"language": "en", "wording": en, "main": True}], "glossary": [], "includedIn": []}


def setup():
    tl, recs = [], {}
    i = 0
    lon = -6.62
    while lon < -6.38:
        lat = 53.32
        while lat < 53.42:
            i += 1
            recs[1000 + i] = townland_rec(1000 + i, f"Townland {i}")
            tl.append({"geometry": mapping(box(lon, lat, lon + 0.02, lat + 0.02)),
                       "properties": {"TD_ID": str(i), "ENGLISH": f"TOWNLAND {i}", "LOGAINM_ID": str(1000 + i)}})
            lat += 0.02
        lon += 0.02
    recs[17131] = town_rec(17131, "Lucan", "Leamhcán", -6.4485, 53.3575)            # inside the big suburb polygon
    recs[1416490] = town_rec(1416490, "Leixlip", "Léim an Bhradáin", -6.4955, 53.3657)
    recs[25454] = town_rec(25454, "Straffan", "Teach Srafáin", -6.6000, 53.3330)     # ~1 km outside its polygon
    ua = [
        {"geometry": mapping(box(-6.47, 53.33, -6.40, 53.40)),
         "properties": {"URBAN_AREA_NAME": "Dublin city and suburbs", "URBAN_AREA_CODE": "D"}},
        {"geometry": mapping(box(-6.51, 53.358, -6.48, 53.372)),
         "properties": {"URBAN_AREA_NAME": "Leixlip", "URBAN_AREA_CODE": "L", "URBAN_AREA_GUID": "g-leixlip"}},
        {"geometry": mapping(box(-6.585, 53.336, -6.575, 53.342)),
         "properties": {"URBAN_AREA_NAME": "Straffan", "URBAN_AREA_CODE": "S"}},
    ]
    census = {"g-leixlip": {"name": "Leixlip, Co Kildare", "population": 16733}}
    return build_doc(tl, ua, recs, "test", census=census)


DOC, REPORT = setup()


def area_at(lat, lng):
    aid = DOC["cells"][h3.latlng_to_cell(lat, lng, 8)]
    return DOC["areas"][aid]


def test_matched_town():
    a = area_at(53.3657, -6.4955)
    assert a["kind"] == "town" and a["name"] == "Leixlip"


def test_lucan_is_a_town_inside_dublin_suburbs():
    a = area_at(53.3575, -6.4485)
    assert a["kind"] == "town" and a["name"] == "Lucan"
    assert any(t["town"] == "Lucan" for t in REPORT["suburbTowns"])


def test_suburb_town_radius_is_limited():
    # inside the big urban area but > 2 km from Lucan -> built-up townland, not Lucan
    lat, lng = 53.395, -6.405
    assert km(Point(lng, lat), Point(-6.4485, 53.3575)) > 2.0
    a = area_at(lat, lng)
    assert a["kind"] == "townland" and a["builtUp"] is True


def test_approach_buffer_extends_town_by_one_ring():
    core = {c for c, aid in DOC["cells"].items() if aid == "town:logainm:1416490"}
    ring_only = [c for c in core if not (-6.51 <= cell_point(c).x <= -6.48 and 53.358 <= cell_point(c).y <= 53.372)]
    assert ring_only, "expected buffer cells outside the Leixlip polygon"


def test_match_by_distance_when_point_just_outside_polygon():
    assert any(m["name"] == "Straffan" for m in REPORT["matchedByDistance"])
    assert area_at(53.339, -6.580)["name"] == "Straffan"


def test_rural_townland_is_not_built_up():
    a = area_at(53.41, -6.61)
    assert a["kind"] == "townland" and a["builtUp"] is False


def test_towns_never_overwrite_each_other():
    lucan = {c for c, a in DOC["cells"].items() if a == "town:logainm:17131"}
    leixlip = {c for c, a in DOC["cells"].items() if a == "town:logainm:1416490"}
    assert lucan and leixlip and not (lucan & leixlip)


def test_every_sentence_sourced():
    for a in DOC["areas"].values():
        assert all(s["sourceIds"] for s in a["sentences"])


def test_boundary_record_attaches_to_own_county_town():
    """A Kildare record whose cell centre lies just over the county line still reaches the Kildare town."""
    from build_areas import attach_heritage
    town_cell = h3.latlng_to_cell(53.3657, -6.4955, 8)
    neighbour = [n for n in h3.grid_disk(town_cell, 1) if n != town_cell][0]
    lat, lng = h3.cell_to_latlng(neighbour)
    areas = {"town:logainm:1416490": {"id": "town:logainm:1416490", "kind": "town", "logainmId": 1416490,
                                      "sources": ["logainm"]}}
    cell_area = {town_cell: "town:logainm:1416490"}          # neighbour cell belongs to the other county's file
    niah = [{"REG_NO": 11804045, "NAME": "Leixlip Castle", "RATING": "National", "APPRAISAL": "A fine castle.",
             "COUNTY": "KILDARE", "LATITUDE": lat, "LONGITUDE": lng, "ORIGINAL_TYPE": "country house",
             "DATEFROM": 1835, "DATETO": 1840, "WEBSITE_LINK": "x"},
            {"REG_NO": 1, "NAME": "Dublin House", "RATING": "National", "APPRAISAL": "Other county.",
             "COUNTY": "DUBLIN", "LATITUDE": lat, "LONGITUDE": lng, "WEBSITE_LINK": "y"}]
    attach_heritage(areas, cell_area, [], niah, "kildare")
    assert [t["title"] for t in areas["town:logainm:1416490"]["threads"]] == ["Leixlip Castle"]


def test_census_sentence_joined_by_urban_area_guid():
    a = area_at(53.3657, -6.4955)
    last = a["sentences"][-1]
    assert last["text"] == "At the 2022 census, Leixlip had a population of 16,733."
    assert last["sourceIds"] == ["cso:SAP2022T1T1TOWN22:g-leixlip"]
    assert "cso-census" in a["sources"] and a["teaser"].endswith(last["text"])


def test_no_census_sentence_without_a_cso_town():
    lucan = area_at(53.3575, -6.4485)          # suburb town: no CSO town of its own
    assert not any("census" in s["text"] for s in lucan["sentences"])
