# Where Am I? (Anseo) 🇮🇪
### *Éire Spatial Heritage & Knowledge Engine*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](https://react.dev/)
[![Uber H3](https://img.shields.io/badge/Spatial_Index-Uber_H3_Res_8-000000.svg?logo=uber)](https://h3geo.org/)
[![LangGraph](https://img.shields.io/badge/Agentic_Orchestration-LangGraph-FF6F00.svg)](https://langchain-ai.github.io/langgraph/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_3.4-38b2ac.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> **Where Am I?** partitions Ireland into a continuous grid of ~1 km² discrete spatial units (**Uber H3 Resolution 8**). As a user drives, cycles, or walks, the app runs passively in the background, detects when the user crosses into a new spatial cell, and serves rich ambient local context via an audio tour guide and high-contrast driver heads-up display (HUD).

---

## 🌟 Key Features

* **🚗 Passive Hands-Free Drive Mode**: Real-time simulated GPS corridor tracking with automatic H3 cell entry detection and ambient audio narration via the Web Speech API (*Radio Éire*).
* **📚 Authentic Irish Placename Etymology (Logainm.ie)**: Decomposition of Gaelic root words (*Baile, Cill, Dún, Áth, Cluain, Sliabh, Carn*) and phonetic pronunciation guides.
* **🏰 140,000+ Archaeological Sites (National Monuments Service)**: Ringforts, dolmens, Norman tower houses, holy wells, and crannógs within 1 km radius.
* **🧚 Authentic 1930s Oral History (Dúchas.ie)**: True folklore records, fairy fort warnings, and folk cures collected from primary school children during the 1937–38 Irish Folklore Commission Schools' Scheme.
* **🪨 Geological Survey Ireland (GSI)**: Eskers, peat bog stratigraphy, karst limestone knolls, and glacial valleys.
* **⚡ "Behind the Build" Live Showcase**: An interactive developer view displaying live LangGraph multi-agent execution traces, token consumption, latency benchmarks, and Architecture Decision Records (ADRs).

---

## 🏗️ System Architecture

```
                  ┌──────────────────────────────┐
                  │    GPS Telemetry Stream      │
                  │   (Continuous Lat, Lng)      │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │   Uber H3 Spatial Engine     │
                  │     Resolution 8 (~0.74 km²) │
                  │     O(1) Bitwise Indexing    │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────┴───────────────┐
                  │                              │
         [In Cache / Pre-fetched]           [Cache Miss]
                  │                              │
                  ▼                              ▼
      ┌─────────────────────────┐   ┌─────────────────────────┐
      │ Client-side IndexedDB   │   │  LangGraph Multi-Agent  │
      │ Corridor Expansion      │   │  Enrichment Engine      │
      └───────────┬─────────────┘   └────────────┬────────────┘
                  │                              │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │   Radio Éire Audio Guide     │
                  │   & 4-Layer Context HUD      │
                  └──────────────────────────────┘
```

### Why Uber H3 Resolution 8?
* **Equidistant Hexagons**: Unlike rectangular lat/lng boxes, hexagons have 6 equidistant neighbors, preventing diagonal dead zones and latitude distortion across Ireland.
* **$O(1)$ Coordinate Mapping**: Microsecond coordinate-to-cell conversion without heavy polygon clipping queries.
* **Vehicular Calibration**: At 50–100 km/h, traversing a Res-8 cell takes 45–90 seconds—the optimal pace for a 35-second ambient narration snippet.
* *See full rationale in [ADR-001: Selection of Spatial Indexing System](docs/adr/ADR-001-Spatial-Grid-H3-vs-Geohash-vs-Rectangular.md).*

---

## 🤖 LangGraph Multi-Agent Pipeline

To prevent hallucinations and guarantee historical grounding, enrichment executes across a cyclical state graph:

1. **`GeoScoutNode`**: Queries Overpass OSM + Archaeological Survey of Ireland (ASI) for monuments within cell bounds.
2. **`EtymologySieveNode`**: Connects to the Logainm.ie open API to decompose townland and parish root etymologies.
3. **`FolkloreRetrieverNode`**: Executes hybrid RAG retrieval against the 1937–38 Dúchas Schools' Collection archive.
4. **`StorytellerSynthesizerNode`**: Synthesizes a 35-second spoken radio narration script and 3 driver highlight cards.
5. **`FactGuardVerifierNode`**: Validates that all monuments lie within $\le 1\text{ km}$ and cross-checks historical dates.
* *See full rationale in [ADR-002: Agentic Orchestration Architecture](docs/adr/ADR-002-Agentic-Orchestration-LangGraph-vs-Sequential-Chains.md).*

---

## 📁 Repository Structure

```
where-am-i/
├── docs/
│   ├── adr/                      # Architecture Decision Records
│   │   ├── ADR-001-Spatial-Grid-H3-vs-Geohash-vs-Rectangular.md
│   │   ├── ADR-002-Agentic-Orchestration-LangGraph-vs-Sequential-Chains.md
│   │   └── ADR-003-Offline-First-Mobile-Drive-Mode-Caching.md
│   └── sprints/
│       └── SPRINT_BACKLOG.md     # Jira/Linear Agile backlog & user stories
├── src/
│   ├── components/               # UI Views (DriveHUD, MapExplorer, DevShowcase)
│   ├── data/                     # Authentic Irish routes & heritage knowledge store
│   ├── services/                 # Spatial H3 Engine, Audio TTS, LangGraph Simulator
│   ├── types/                    # Strict TypeScript schemas
│   ├── App.tsx                   # Main state machine
│   └── main.tsx
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Quickstart & Development

### 1. Prerequisites
* **Node.js** v18+ 
* **npm** or **pnpm**

### 2. Installation
```bash
git clone https://github.com/your-username/where-am-i.git
cd where-am-i
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Production Build
```bash
npm run build
npm run preview
```

---

## 📋 Engineering Methodology & Recruiter Review

This project was built to demonstrate enterprise-grade engineering rigor:
* **Architecture Decision Records (ADRs)**: Documenting trade-offs, discarded alternatives, and technical decisions.
* **Sprint Backlog**: Full user story breakdown with acceptance criteria and story points (`docs/sprints/SPRINT_BACKLOG.md`).
* **Clean Code & Strict Typing**: TypeScript strict mode enabled with 0 build warnings.
* **Interactive Showcase**: Recruiters can test the live agent trace runner inside the app without needing API keys.

---

## 📜 Cultural Open Data Sources

* **[Logainm.ie](https://www.logainm.ie/)**: The Placenames Database of Ireland, developed by Fiontar & Scoil na Gaeilge (DCU) and the Department of Tourism, Culture, Arts, Gaeltacht, Sport and Media.
* **[Dúchas.ie](https://www.duchas.ie/)**: National Folklore Collection, UCD.
* **[National Monuments Service (ASI)](https://www.archaeology.ie/)**: Department of Housing, Local Government and Heritage.
* **[Geological Survey Ireland (GSI)](https://www.gsi.ie/)**: Department of the Environment, Climate and Communications.

---

## ⚖️ License
Released under the [MIT License](LICENSE).
