import h3
from features import build_features, npws_feature, spoken_name, oriented_lines
from shapely.geometry import Polygon


def square(lng, lat, d=0.01, cw=False):
    pts = [(lng, lat), (lng + d, lat), (lng + d, lat + d), (lng, lat + d), (lng, lat)]
    return pts[::-1] if cw else pts


def gj(name, code, kind, ring):
    return {"features": [{"properties": {"SITE_NAME": name, "SITECODE": code, "designation": kind, "URL": ""},
                          "geometry": {"type": "Polygon", "coordinates": [ring]}}]}


def keep_all(ring):
    return set().union(*[set(h3.grid_disk(h3.latlng_to_cell(y, x, 8), 3)) for x, y in ring])


def test_spoken_text_and_mechanical_edits():
    fid, m = npws_feature({"SITE_NAME": "Rye Water Valley/Carton SAC", "SITECODE": "001398", "designation": "sac", "URL": ""})
    assert fid == "npws-sac-001398"
    assert m["name"] == "Rye Water Valley/Carton"
    assert m["spoken"] == ("You're entering the Rye Water Valley and Carton Special Area of Conservation, "
                           "as listed by the National Parks and Wildlife Service.")
    assert m["sourceIds"] == ["npws:sac:001398"] and m["url"].endswith("/sac/001398")
    assert spoken_name("A / B") == "A and B"


def test_rings_are_oriented_inside_on_left_even_if_source_is_clockwise():
    lines, closed = oriented_lines(Polygon(square(-6.6, 53.38, cw=True)))
    assert closed and Polygon(lines[0]).exterior.is_ccw


def test_same_site_in_two_polygons_is_one_feature_and_cells_only_in_county():
    ring = square(-6.6, 53.38)
    doc = gj("Royal Canal", "002103", "pnha", ring)
    doc["features"].append(gj("Royal Canal", "002103", "pnha", square(-6.55, 53.38))["features"][0])
    keep = keep_all(ring)
    feats, cells = build_features(doc, keep)
    assert list(feats) == ["npws-pnha-002103"]
    assert cells and set(cells) <= keep
    for c, entries in cells.items():
        for fid, coords in entries:
            assert fid == "npws-pnha-002103" and len(coords) >= 4 and len(coords) % 2 == 0


def test_candidate_spa_label_and_site_key_shared_across_designations():
    _, m = npws_feature({"SITE_NAME": "North-West Irish Sea cSPA", "SITECODE": "004236", "designation": "spa", "URL": ""})
    assert m["spoken"].startswith("You're entering the North-West Irish Sea candidate Special Protection Area")
    _, a = npws_feature({"SITE_NAME": "Rye Water Valley/Carton SAC", "SITECODE": "001398", "designation": "sac"})
    _, b = npws_feature({"SITE_NAME": "Rye Water Valley/Carton", "SITECODE": "001398", "designation": "pnha"})
    assert a["siteKey"] == b["siteKey"] and a["priority"] < b["priority"]


def _line_gj(name, coords):
    return {"features": [{"properties": {"EPA_Name": name}, "geometry": {"type": "LineString", "coordinates": coords}}]}


def test_only_approved_river_names_are_spoken():
    coords = [(-6.6, 53.37), (-6.6, 53.39)]
    keep = keep_all(coords)
    approved = [{"epaName": "Rye Water", "spoken": "the Rye Water", "approved": True},
                {"epaName": "KILMURRY 09", "spoken": "x", "approved": False}]
    f, _ = build_features(None, keep, _line_gj("Rye Water", coords), None, approved)
    assert f["epa-river-rye-water"]["spoken"] == "You're crossing the Rye Water."
    assert f["epa-river-rye-water"]["closed"] is False
    f, _ = build_features(None, keep, _line_gj("KILMURRY 09", coords), None, approved)
    assert f == {}


def test_canal_polygon_is_an_open_crossing_feature():
    ring = square(-6.6, 53.38, d=0.0003)
    doc = {"features": [{"properties": {"Canal_Name": "Royal Canal"}, "geometry": {"type": "Polygon", "coordinates": [ring]}}]}
    f, cells = build_features(None, keep_all(ring), None, doc, [])
    assert f["wi-canal-royal-canal"]["spoken"] == "You're crossing the Royal Canal." and f["wi-canal-royal-canal"]["closed"] is False
