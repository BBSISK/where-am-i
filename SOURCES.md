# Data sources in use

Only sources actually used by the running app are listed here. Each entry states the licence and the attribution it requires.

| Source | Used for | Licence | Attribution | Since |
|---|---|---|---|---|
| [Logainm](https://www.logainm.ie), Placenames Database of Ireland (Gaois, DCU), via API v1.0 | Irish/English place names, validation status, glossary elements, parish | CC BY 4.0 | Irish-language placename data by Logainm © Government of Ireland and licensed under CC BY 4.0. | 2026-11 |
| [Tailte Éireann: Townlands, National Statutory Boundaries 2019, Generalised 20m](https://www.arcgis.com/home/item.html?id=1dc58c98ab004234ad0445e79a0f9af7) | Townland areas (H3 cell → townland), joined to Logainm by `LOGAINM_ID` | CC BY 4.0 | © Tailte Éireann (generalised: reference only) | 2026-11 |
| [Tailte Éireann / CSO: Urban Areas 2022, Generalised 20m](https://www.arcgis.com/home/item.html?id=5468708d36454d1f95a3ff23cbaeb2f5) | Town areas (only where matched to a Logainm town) | CC BY 4.0 | © Tailte Éireann | 2026-11 |
| [Archaeological Survey of Ireland: Sites and Monuments Record](https://maps.archaeology.ie/historicenvironment) (National Monuments Service, Dept of Housing, Local Government and Heritage) | "Tell me more" monument threads (testbed towns), spoken in the record's own wording | CC BY 4.0 | Copyright Government of Ireland. Created by National Monuments Service, Department of Housing, Local Government and Heritage. | 2026-11 |
| [National Inventory of Architectural Heritage](https://www.buildingsofireland.ie) (Dept of Housing, Local Government and Heritage) | "Tell me more" building threads (National-rated only, testbed towns), spoken in the record's own wording | CC BY 4.0 | Copyright Government of Ireland. Created by National Inventory of Architectural Heritage, Department of Housing, Local Government and Heritage. | 2026-11 |
| [CSO Census of Population 2022, SAPS by town (SAP2022T1T1TOWN22)](https://data.cso.ie/table/SAP2022T1T1TOWN22) | One sentence per CSO town: its 2022 population (exact join on the urban-area GUID) | CC BY 4.0 | Source: Central Statistics Office, Census of Population 2022. | 2026-11 |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) via [Nominatim](https://nominatim.org/) | Fallback place name outside covered counties | ODbL 1.0 | © OpenStreetMap contributors | 2026-11 |

Coverage so far: place names for **Kildare and Dublin**; monument and building threads for the **testbed towns Lucan, Leixlip and Maynooth**. Built by `pipeline/` (see [pipeline/README.md](pipeline/README.md)).

## Not available yet
- Logainm explanatory notes (meanings of whole names) are not in the Logainm API; access has been requested from Gaois.

## Removed (November 2026)
All earlier curated heritage content (folklore, census, archive, art, military and archaeological claims) was removed: much of it could not be traced to primary sources, and some citations and quotations were found to be wrong or invented.

## Editing rules for spoken heritage text
Monument and building threads use the official record's own words. The only edits (see `pipeline/heritage.py`, all unit-tested) are: removing the "Compiled by / Date of upload" footer; removing parenthetical bibliographic references, record codes and measurements; "c. 1780" → "circa 1780"; compass shorthand → words. Each thread links to its official record.

## Licensing status (decision log)
- **2026-11-04: non-commercial for now (Barry).** Dúchas (National Folklore Collection) is licensed CC BY-NC 4.0, which forbids commercial use. The app may use Dúchas material while it is non-commercial. **Before any commercial use**, either obtain permission from the National Folklore Collection (UCD) / Gaois, or remove Dúchas content (it will sit behind a single build switch). All other sources listed above are CC BY 4.0 or ODbL and allow commercial use with attribution.
