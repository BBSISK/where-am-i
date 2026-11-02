# Where Am I? (Anseo)

A hands-free, GPS-driven companion for driving in Ireland. As you move, the app works out which ~0.74 km² hexagonal cell you're in (Uber H3, resolution 8) and, in time, will tell you about the place: starting with the meaning of its name.

> **Status: rebuilding (November 2026).** All earlier heritage content was removed because it could not be traced to primary sources. The app now shows and speaks **only verified information**. For most places that is currently just the place name from OpenStreetMap. Real data is being added through a sourced pipeline (see *Roadmap*).

## What works today
- **Live GPS tracking** with screen wake lock, and H3 cell-entry detection (`h3-js`).
- **Place name** for your location from OpenStreetMap (Nominatim), cached and rate-limited to its usage policy.
- **Audio** via the device's built-in voice (Web Speech API). Accent preference en-IE > en-GB; the app makes no claims about voice gender.
- **Voice commands** ("Tell me more", etc.) via the Web Speech API.
- **Simulated test route** (Lucan → Leixlip → Maynooth) for testing without driving.
- **CI** (GitHub Actions): type check, build, unit tests (Vitest), and a *secret guard* that fails the build if an API key or a direct ElevenLabs call appears in the public bundle.

## Roadmap
1. Teaser plays once per area (town/village in built-up areas, otherwise townland), never interrupts "Tell me more", with a minimum quiet gap.
2. Data pipeline: Tailte Éireann townland boundaries + CSO settlement boundaries → H3 cell → area; place-name records from **Logainm** (CC BY 4.0).
3. Etymology teaser built **only** from Logainm records, with a citation for every sentence (enforced by a CI test).
4. Server-side text-to-speech proxy (the ElevenLabs key never reaches the browser).
5. Further sources (National Monuments Service, NIAH, CSO small-area statistics), each added only after its licence is checked.

## Rigour rules
- Every fact shown or spoken traces to a stored source record. No record, no claim.
- No invented identifiers, quotations, figures or citations.
- Simulated features are labelled as simulated.
- Secrets never go in `VITE_` variables or the client bundle.
- This README describes only what is built; everything else is under *Roadmap*.

See [SOURCES.md](SOURCES.md) for the data sources actually in use and their licences.

## Development
```bash
npm install
npm run dev     # local dev server
npm test        # unit tests
npm run build   # type check + production build
```

## Licence
Code: MIT (see [LICENSE](LICENSE)). Data: see [SOURCES.md](SOURCES.md).
