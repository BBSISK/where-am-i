# ADR-003: Offline-First Drive Mode & Corridor Pre-fetching

## Status
**Accepted** (Sprint 1)

## Context
Rural Ireland (e.g., Connemara, West Cork, the Wicklow Mountains) frequently suffers from intermittent or nonexistent cellular connectivity (2G/3G dead zones). An app that relies on real-time internet requests for every kilometer driven will fail or stutter awkwardly.

## Decision
1. **Route Corridor Pre-fetching**:
   - When the user selects or starts navigating along a route corridor (or based on heading vector), the client requests a compressed bundle of H3 cells 5–10 km ahead (`kRing` expansion along the trajectory).
2. **Client-Side Caching (IndexedDB / SQLite)**:
   - Enriched audio scripts, phonetic placename data, and monument summaries are stored in a local client-side IndexedDB store.
3. **On-Device Audio Synthesis (Web Speech API / Offline Voice Fallback)**:
   - High-fidelity pre-synthesized audio can be cached, while real-time dynamic alerts fall back smoothly to device-native Web Speech API speech synthesis without requiring an active network connection.
