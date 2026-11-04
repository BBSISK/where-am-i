"""
Named bridges, so a crossing can say "on Leixlip Bridge".

Only records that ARE bridges (record type) AND whose recorded name says so ("... Bridge", "... Aqueduct",
"... Viaduct"). Footbridges are left out (you don't drive over them). The app uses a bridge only when the
actual crossing point is within BRIDGE_MATCH_M of it (src/services/crossings.ts).

Storage (per county file):  bridges: {h3cell: [[lng, lat, name, sourceId], ...]}
"""
import re
import h3

RES = 8
NIAH_TYPES = re.compile(r"^(bridge|canal bridge|railway bridge|aqueduct|viaduct)$", re.I)
RPS_TYPES = re.compile(r"^(bridge|canal bridge|canal bridge and lock|railway bridge|aqueduct|viaduct)$", re.I)
NAMED = re.compile(r"\b(bridge|aqueduct|aquaduct|viaduct)\b", re.I)


def bridge_name(name):
    """Recorded name up to the first comma ("William Bridge, Maynooth, Co. Kildare" -> "William Bridge")."""
    n = (name or "").split(",")[0].strip()
    return n if NAMED.search(n) else None


def bridge_points(niah_records, rps_records, keep_cells):
    out = {}
    seen = []

    def add(lat, lng, name, sid):
        c = h3.latlng_to_cell(lat, lng, RES)
        if c not in keep_cells:
            return
        # one point per named bridge: the NIAH record wins over a council record of the same name nearby
        for (la, ln, nm) in seen:
            if nm.lower() == name.lower() and abs(la - lat) < 0.0005 and abs(ln - lng) < 0.0008:
                return
        seen.append((lat, lng, name))
        out.setdefault(c, []).append([round(lng, 6), round(lat, 6), name, sid])

    for r in niah_records:
        name = bridge_name(r.get("NAME"))
        if name and NIAH_TYPES.match((r.get("ORIGINAL_TYPE") or "").strip()) and r.get("LATITUDE") is not None:
            add(r["LATITUDE"], r["LONGITUDE"], name, f"niah:{r['REG_NO']}")
    for r in rps_records:
        name = bridge_name(r.get("name"))
        if name and RPS_TYPES.match((r.get("descr") or "").strip()) and r.get("lat") is not None:
            add(r["lat"], r["lng"], name, f"rps:{r['councilKey']}:{r['rpsNo']}")
    return out
