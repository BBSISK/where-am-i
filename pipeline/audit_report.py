"""
"Spoken lines" audit page: every line the app can say, per town, with its source records and licence.

Written to public/audit.html (served with the app at /audit.html). Barry reviews it town by town and
records sign-off in pipeline/review/towns.json; the page shows that status. Nothing here is generated
prose: it only lists what is already in the area files.

Usage:  python pipeline/audit_report.py
"""
import html, json, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AREAS = ROOT / "public" / "data" / "areas"
OUT = ROOT / "public" / "audit.html"
REVIEW = Path(__file__).resolve().parent / "review" / "towns.json"


def e(s):
    return html.escape(str(s if s is not None else ""))


def licences(doc, keys):
    return ", ".join(sorted({doc["sources"].get(k, {}).get("licence", "?") for k in keys}))


def source_ctx():
    """Source records for showing the original text beside each story (only where caches exist)."""
    try:
        import build_areas as b
        from stories import make_ctx
        smr, niah, mtv, rps, gsi, dib, _ = b.load_heritage()
        if not smr:
            return None
        areas = {}
        for c in json.loads((AREAS / "index.json").read_text())["counties"]:
            areas.update(json.loads((AREAS / f"{c}.json").read_text())["areas"])
        return make_ctx(areas, smr, niah, mtv, rps, gsi, dib, b.load_census())
    except Exception:
        return None


CTX = None


def source_details(sids):
    if not CTX:
        return ""
    from stories import source_text
    parts = "".join(f"<p><b>{e(sid)}</b>: {e(source_text(sid, CTX) or '(not found)')}</p>" for sid in sids)
    return f"<details><summary>Source text the story was written from</summary>{parts}</details>"


def area_section(doc, a, review):
    rv = review.get(a["id"])
    status = (f'<span class="ok">Approved {e(rv.get("date"))} by {e(rv.get("by"))}</span>' if rv
              else '<span class="todo">Not yet reviewed</span>')
    if a.get("storyStatus"):
        status += f' <span class="todo">Stories: {e(a["storyStatus"])}</span>'
    for r in a.get("storyReport", []):
        status += f'<br><span class="bad">Not spoken: {e(r["item"])} ({e(r["reason"])})</span>' 
    rows = []
    for s in a.get("sentences", []):
        rows.append(f"<tr><td>Teaser</td><td>{e(s['text'])}</td><td>{e(', '.join(s['sourceIds']))}</td>"
                    f"<td>{e(licences(doc, a['sources']))}</td><td></td></tr>")
    for t in a.get("threads", []):
        img = t.get("image")
        img_cell = (f'<a href="{e(img["sourceUrl"])}">{e(img["credit"])}</a><br><small>{e(img["licence"])}</small>'
                    if img else "")
        rows.append(f"<tr><td>Tell me more<br><small>{e(t['category'])}</small></td><td><b>{e(t['title'])}</b><br>"
                    f"{e(t['spokenNarrative'])}{source_details(t['sourceIds']) if t['id'].startswith('story-') else ''}"
                    f"<br><small>{len(t['spokenNarrative'].split())} words</small></td><td>{e(', '.join(t['sourceIds']))}</td>"
                    f"<td>{e(licences(doc, t['sources']))}</td><td>{img_cell}</td></tr>")
    return (f'<section><h3>{e(a["name"])} <small>({e(a["kind"])}, {e(a["id"])})</small> {status}</h3>'
            f'<table><tr><th>Type</th><th>What the app says</th><th>Source records</th><th>Licence</th>'
            f'<th>Photo</th></tr>{"".join(rows)}</table></section>')


def crossings_section(doc):
    rows = []
    for fid, f in sorted(doc.get("features", {}).items(), key=lambda x: (x[1]["priority"], x[1]["name"])):
        rows.append(f"<tr><td>{e(f['kind'])}</td><td>{e(f['spoken'])}</td><td>{e(', '.join(f['sourceIds']))}</td>"
                    f"<td>{e(licences(doc, f['sources']))}</td></tr>")
    bridges = sorted({(b[2], b[3]) for pts in doc.get("bridges", {}).values() for b in pts})
    blist = "".join(f"<li>{e(n)} <small>({e(s)})</small></li>" for n, s in bridges)
    return (f"<h3>Crossings ({len(rows)})</h3><p>Spoken only when the line between two GPS fixes crosses the "
            f"feature; \"Coming up\" uses the same lines for rivers and canals ahead.</p>"
            f"<table><tr><th>Kind</th><th>What the app says</th><th>Source records</th><th>Licence</th></tr>"
            f"{''.join(rows)}</table><h3>Named bridges ({len(bridges)})</h3><p>Added as \", on NAME\" only when the "
            f"crossing point is within 40 m.</p><ul class=\"cols\">{blist}</ul>")


def main():
    global CTX
    CTX = source_ctx()
    review = json.loads(REVIEW.read_text()).get("towns", {}) if REVIEW.exists() else {}
    idx = json.loads((AREAS / "index.json").read_text())
    parts = []
    for county in idx["counties"]:
        doc = json.loads((AREAS / f"{county}.json").read_text())
        towns = sorted((a for a in doc["areas"].values() if a.get("threads")), key=lambda a: a["name"])
        other = len(doc["areas"]) - len(towns)
        parts.append(f"<h2>{e(county.title())}</h2><p>Built {e(doc.get('builtAt'))}. "
                     f"{len(towns)} areas with Tell-me-more threads (shown in full); {other} other areas speak "
                     f"only their sourced teaser.</p>")
        parts += [area_section(doc, a, review) for a in towns]
        parts.append(crossings_section(doc))
    OUT.write_text(f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Where Am I: spoken lines audit</title>
<style>
body{{font:14px/1.45 system-ui,sans-serif;margin:16px;background:#0f172a;color:#e2e8f0}}
table{{border-collapse:collapse;width:100%;margin:8px 0 24px}}td,th{{border:1px solid #334155;padding:6px;vertical-align:top;text-align:left}}
th{{background:#1e293b}}small{{color:#94a3b8}}a{{color:#7dd3fc}}.ok{{color:#4ade80;font-size:12px}}.todo{{color:#fbbf24;font-size:12px}}.bad{{color:#f87171;font-size:12px}}details{{margin-top:6px;color:#94a3b8}}
.cols{{columns:3 220px}}h2{{border-bottom:1px solid #334155;padding-bottom:4px}}
@media (max-width:700px){{td,th{{font-size:12px}}}}
</style></head><body><h1>Spoken lines audit</h1>
<p>Every line the app can say, with its source records and licence. Generated {e(time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime()))}
from the published area files. Sign-off is recorded in <code>pipeline/review/towns.json</code>.</p>
{''.join(parts)}</body></html>""")
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
