# Data sources in use

Only sources actually used by the running app are listed here. Each entry states the licence and the attribution it requires.

| Source | Used for | Licence | Attribution | Since |
|---|---|---|---|---|
| [Logainm](https://www.logainm.ie), Placenames Database of Ireland (Gaois, DCU), via API v1.0 | Irish/English place names, validation status, glossary elements, parish | CC BY 4.0 | Irish-language placename data by Logainm © Government of Ireland and licensed under CC BY 4.0. | 2026-11 |
| [Tailte Éireann: Townlands, National Statutory Boundaries 2019, Generalised 20m](https://www.arcgis.com/home/item.html?id=1dc58c98ab004234ad0445e79a0f9af7) | Townland areas (H3 cell → townland), joined to Logainm by `LOGAINM_ID` | CC BY 4.0 | © Tailte Éireann (generalised: reference only) | 2026-11 |
| [Tailte Éireann / CSO: Urban Areas 2022, Generalised 20m](https://www.arcgis.com/home/item.html?id=5468708d36454d1f95a3ff23cbaeb2f5) | Town areas (only where matched to a Logainm town) | CC BY 4.0 | © Tailte Éireann | 2026-11 |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) via [Nominatim](https://nominatim.org/) | Fallback place name outside covered counties | ODbL 1.0 | © OpenStreetMap contributors | 2026-11 |

Coverage so far: **Kildare and Dublin.** Built by `pipeline/` (see [pipeline/README.md](pipeline/README.md)).

## Not available yet
- Logainm explanatory notes (meanings of whole names) are not in the Logainm API; access has been requested from Gaois.

## Removed (November 2026)
All earlier curated heritage content (folklore, census, archive, art, military and archaeological claims) was removed: much of it could not be traced to primary sources, and some citations and quotations were found to be wrong or invented.
