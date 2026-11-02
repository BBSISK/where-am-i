> **Superseded (2026-11).** This backlog predates the rebuild and describes plans, not what was built. See the README *Roadmap* for current status.

# Where Am I? (Anseo) - Jira/Linear Sprint Backlog & Methodology

## Project Overview
* **Product**: Where Am I? (Éire Spatial Intelligence)
* **Methodology**: Agile Scrum with 2-week sprints, Architecture Decision Records (ADRs), and Git Flow.
* **Target Audience**: Drivers, tourists, heritage enthusiasts in Ireland, and prospective engineering employers reviewing technical architecture and execution.

---

## Epic Overview

| Epic ID | Title | Description | Status |
| :--- | :--- | :--- | :--- |
| **EPIC-1** | **Spatial Grid & Geodesic Engine** | Tile Ireland into ~1km² discrete cells (Uber H3 Res 8), fast coordinate-to-cell indexing, and route heading corridor prefetching. | 🟢 In Progress |
| **EPIC-2** | **Multi-Source Data Ingestion & Harvesting** | Ingest Logainm (placenames), Dúchas.ie (Schools' Collection folklore), National Monuments Service, and OSM heritage features. | 🟡 Todo |
| **EPIC-3** | **LangGraph Agentic Knowledge Synthesis** | Multi-agent state machine (Scout, Sieve, Storyteller, Fact Guard) transforming raw geo-data into high-impact spoken audio scripts and cards. | 🟡 Todo |
| **EPIC-4** | **Drive Mode Experience & Audio Narration** | Geolocation tracking simulator, hands-free Text-to-Speech (TTS) triggering, and car-friendly dashboard UI. | 🟡 Todo |
| **EPIC-5** | **"Behind the Build" Recruiter Showcase & Observability** | Interactive dev dashboard inside the app displaying ADRs, live agent execution traces, token metrics, and architecture diagrams. | 🟡 Todo |

---

## Sprint 1: Spatial Engine, Simulation & Architecture Foundation
**Goal**: Establish repository foundation, H3 spatial grid indexer, interactive map with real-time GPS road simulation, and technical documentation (ADRs).

### User Stories & Acceptance Criteria

#### `WAI-101`: Project Repository Initialization & CI Architecture
* **Story**: As a developer, I want a clean, modular repository with TypeScript, Tailwind CSS, linting, and automated tests so that code quality and professional standards are upheld.
* **Story Points**: 3
* **Acceptance Criteria**:
  - [x] Git repo initialized with standard `.gitignore` and branching policy (`main`, `develop`, `feature/*`).
  - [x] TypeScript + Vite/React framework setup.
  - [x] Initial Architecture Decision Records (ADRs) documented in `/docs/adr/`.

#### `WAI-102`: Spatial Hexagonal Grid Generator (Uber H3 Res 8)
* **Story**: As a driver moving across Ireland, the app must map any GPS coordinate `(latitude, longitude)` to an exact ~1km² spatial unit in $O(1)$ constant time.
* **Story Points**: 5
* **Acceptance Criteria**:
  - [ ] Implement `geoToH3(lat, lng, resolution = 8)` returning unique 64-bit hexadecimal identifiers.
  - [ ] Implement `h3ToGeoBoundary(h3Index)` returning exact polygon vertices for map rendering.
  - [ ] Implement corridor expansion (`kRing(h3Index, radius = 2)`) to identify adjacent cells along travel vector.

#### `WAI-103`: Interactive Ireland Map & Driving Simulator
* **Story**: As a user or portfolio reviewer, I want to watch a simulated vehicle drive along an iconic Irish route (e.g., M7 Dublin to Limerick, or Wild Atlantic Way Galway/Clifden) and see the active grid cell update in real-time.
* **Story Points**: 5
* **Acceptance Criteria**:
  - [ ] Interactive Leaflet/MapLibre map centered on Ireland with toggleable H3 grid boundaries.
  - [ ] Route simulator with Play/Pause, speed adjustment (1x, 5x, 10x), and route selector.
  - [ ] Visual highlight on the currently active H3 cell and direction of travel.

#### `WAI-104`: Ambient Story Card & Audio Trigger Hook
* **Story**: As a driver entering a new grid cell, the app should emit an entry event, display the local placename etymology & monument card, and speak the audio narration.
* **Story Points**: 5
* **Acceptance Criteria**:
  - [ ] State management tracking `currentH3Index` and `visitedCells`.
  - [ ] Web Speech API integration with play/pause/mute audio controls.
  - [ ] Responsive card UI rendering:
    - Townland & Irish Placename with phonetic breakdown (*Logainm*).
    - Monuments count (*Ringforts, Castles, Holy Wells*).
    - Audio story narrative.

---

## Sprint 2: Data Ingestion & LangGraph Agent Pipeline (Upcoming)
* `WAI-201`: Logainm.ie Placename Etymology Resolver
* `WAI-202`: Dúchas.ie Folklore & Stories Ingestion
* `WAI-203`: National Monuments Service Archaeological GeoJSON Parser
* `WAI-204`: LangGraph State Machine (Scout -> Storyteller -> Fact Guard)

---

## Sprint 3: "Behind the Build" Showcase & Production Polish (Upcoming)
* `WAI-301`: Interactive Architecture & State Machine Inspector
* `WAI-302`: Live Agent Tracing & Token Cost Telemetry
* `WAI-303`: ADR Document Viewer & GitHub Readme Packaging

