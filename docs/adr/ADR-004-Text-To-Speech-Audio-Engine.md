# ADR-004: Dual-Tier Speech Synthesis Architecture (ElevenLabs Emotive AI Voice + Native Fallback)

## Status
**Revised** (2026-11): Tier 2 (device Web Speech voice) is implemented. Tier 1 (ElevenLabs) will run only through a server-side proxy; keys never go in the browser. Not implemented yet.

## Context
"Where Am I?" functions as an ambient, hands-free travel companion (*Radio Éire*). The auditory experience is the primary user interface while driving. Native browser Web Speech API voices often sound mechanical, flat, and robotic, diminishing the emotional resonance of centuries-old Irish folklore, famine memories, and placename pronunciations.

## Decision
We implement a **Dual-Tier Audio Delivery Engine**:

1. **Tier 1 (Premium / Emotive)**: **ElevenLabs AI Voice Integration**
   - Utilizes `eleven_turbo_v2_5` and `eleven_multilingual_v2` models for ultra-realistic inflection, authentic Irish and Celtic cadence, and cinematic storytelling depth.
   - Supports voice presets specifically suited for historical and geographic narration (e.g. *Fin - Irish Storyteller*, *George - Warm Documentary Narrator*).
   - **Client-Side Blob Caching**: Audio buffers are hashed by H3 cell ID and cached in browser memory/IndexedDB to prevent duplicate API billing and reduce latency to near zero on cached routes.

2. **Tier 2 (Resilient / Zero-Cost Fallback)**: **W3C Web Speech API**
   - Runs client-side without API keys or internet connection.
   - Automatically activates when offline in rural dead zones (ADR-003) or when no ElevenLabs API token is supplied.

## Consequences
* **Positive**: Extraordinary audio immersion worthy of production commercial products; resilient zero-cost offline fallback; client-side caching protects user API quotas.
* **Negative**: ElevenLabs incurs API usage costs for newly generated tiles outside the cache.
