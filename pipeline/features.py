"""
Crossing features: things you drive INTO or ACROSS (protected areas, rivers, canals).

The app detects a crossing exactly: the line between two consecutive GPS fixes must intersect the
feature's geometry. Driving alongside a river never counts as crossing it.

Storage (per county file):
  features:     {fid: {kind, name, spoken, sourceIds, sources, url}}
  featureCells: {h3cell: [[fid, [lng, lat, lng, lat, ...]], ...]}  polylines touching that cell.
Polygon rings are oriented so the INSIDE is on the LEFT of each segment (exterior anticlockwise,
holes clockwise); the app uses that to tell entering from leaving.
"""
import re
import h3
from shapely.geometry import shape, Polygon, MultiPolygon, LineString, MultiLineString
from shapely.geometry.polygon import orient

RES = 8
SIMPLIFY_DEG = 0.00003  # about 3 m: well below GPS error

DESIGNATION = {
    "sac": ("Special Area of Conservation", 2),
    "spa": ("Special Protection Area", 3),
    "nha": ("Natural Heritage Area", 4),
    "pnha": ("proposed Natural Heritage Area", 5),
}
SUFFIX = re.compile(r"\s+(cSPA|SAC|SPA|NHA|pNHA)$")


def spoken_name(name):
    """Mechanical edits only: "/" read as "and" (TTS would say "slash")."""
    return re.sub(r"\s*/\s*", " and ", name)


def npws_feature(props):
    kind = props["designation"]
    label, priority = DESIGNATION[kind]
    raw = (props.get("SITE_NAME") or "").strip()
    if raw.endswith(" cSPA"):
        label = "candidate " + label
    name = SUFFIX.sub("", raw)
    code = props["SITECODE"]
    return f"npws-{kind}-{code}", {
        "kind": "protected-area", "designation": kind, "priority": priority, "name": name,
        "siteKey": f"npws:{code}",  # one site can be both a SAC and a pNHA: announced once
        "displayName": f"{name} {label}",
        "spoken": f"You're entering the {spoken_name(name)} {label}, as listed by the National Parks and Wildlife Service.",
        "sourceIds": [f"npws:{kind}:{code}"], "sources": ["npws"],
        "url": props.get("URL") or f"https://www.npws.ie/protected-sites/{kind}/{code}",
    }


def oriented_lines(geom):
    """Lines to test against. Polygons -> oriented rings (inside on the left)."""
    g = geom.simplify(SIMPLIFY_DEG, preserve_topology=True)
    if isinstance(g, (Polygon, MultiPolygon)):
        polys = [g] if isinstance(g, Polygon) else list(g.geoms)
        out = []
        for p in polys:
            p = orient(p, sign=1.0)
            out.append(list(p.exterior.coords))
            out += [list(r.coords) for r in p.interiors]
        return out, True
    if isinstance(g, LineString):
        return [list(g.coords)], False
    if isinstance(g, MultiLineString):
        return [list(l.coords) for l in g.geoms], False
    return [], False


def segment_cells(a, b):
    ca, cb = h3.latlng_to_cell(a[1], a[0], RES), h3.latlng_to_cell(b[1], b[0], RES)
    try:
        return set(h3.grid_path_cells(ca, cb))
    except Exception:
        return {ca, cb}


def cell_polylines(lines, keep_cells):
    """Split lines into per-cell polylines (direction preserved). Only cells in keep_cells are kept."""
    out = {}
    for coords in lines:
        for a, b in zip(coords, coords[1:]):
            for c in segment_cells(a, b):
                if c not in keep_cells:
                    continue
                runs = out.setdefault(c, [])
                if runs and runs[-1][-2:] == [round(a[0], 6), round(a[1], 6)]:
                    runs[-1] += [round(b[0], 6), round(b[1], 6)]
                else:
                    runs.append([round(a[0], 6), round(a[1], 6), round(b[0], 6), round(b[1], 6)])
    return out


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def river_feature(epa_name, approved):
    """Only names approved in review/rivers.json are spoken; everything else is skipped."""
    entry = approved.get(epa_name)
    if not entry:
        return None, None
    return f"epa-river-{slug(epa_name)}", {
        "kind": "river", "priority": 1, "name": epa_name,
        "displayName": re.sub(r"\s\d\d$", "", epa_name),  # drop the EPA catchment number ("Lyreen 09")
        "spoken": f"You're crossing {entry['spoken']}.",
        "sourceIds": [f"epa-rivers:{epa_name}"], "sources": ["epa-rivers"],
        "url": "https://gis.epa.ie/EPAMaps/Water",
    }


CANALS = ("Grand Canal", "Royal Canal")


def canal_feature(props):
    name = next((c for c in CANALS if (props.get("Canal_Name") or "").startswith(c)), None)
    if not name:
        return None, None
    return f"wi-canal-{slug(name)}", {
        "kind": "canal", "priority": 1, "name": name, "displayName": name,
        "spoken": f"You're crossing the {name}.",
        "sourceIds": [f"wi-canals:{props.get('Canal_Name')}"], "sources": ["wi-canals"],
        "url": "https://www.waterwaysireland.org",
    }


def _add(features, feature_cells, fid, meta, geom, keep_cells, closed_override=None):
    lines, closed = oriented_lines(shape(geom))
    per_cell = cell_polylines(lines, keep_cells)
    if not per_cell:
        return
    # canals are narrow polygons: any edge you cross is a crossing (in and out happen in one GPS step)
    meta["closed"] = closed if closed_override is None else closed_override
    features.setdefault(fid, meta)
    for c, runs in per_cell.items():
        feature_cells.setdefault(c, []).extend([fid, r] for r in runs)


def build_features(npws_geojson, keep_cells, rivers_geojson=None, canals_geojson=None, approved_rivers=None):
    """Merge pieces of the same site / river / canal into one feature; return (features, featureCells)."""
    features, feature_cells = {}, {}
    for f in (npws_geojson or {}).get("features", []):
        if f.get("geometry"):
            fid, meta = npws_feature(f["properties"])
            _add(features, feature_cells, fid, meta, f["geometry"], keep_cells)
    approved = {r["epaName"]: r for r in (approved_rivers or []) if r.get("approved")}
    for f in (rivers_geojson or {}).get("features", []):
        if f.get("geometry"):
            fid, meta = river_feature(f["properties"].get("EPA_Name"), approved)
            if fid:
                _add(features, feature_cells, fid, meta, f["geometry"], keep_cells)
    for f in (canals_geojson or {}).get("features", []):
        if f.get("geometry"):
            fid, meta = canal_feature(f["properties"])
            if fid:
                _add(features, feature_cells, fid, meta, f["geometry"], keep_cells, closed_override=False)
    return features, feature_cells
