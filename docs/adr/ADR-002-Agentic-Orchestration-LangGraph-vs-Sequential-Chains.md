# ADR-002: Agentic Orchestration Architecture (LangGraph State Machine vs Linear RAG Chains)

## Status
**Withdrawn** (2026-11). Never implemented: the app only contained a simulated trace, which has been removed. Any future narration design will get a new ADR.

## Context
Enriching a 1 km² H3 cell requires orchestrating heterogeneous data sources:
- Logainm placenames & etymology (Gaelic roots)
- National Monuments Service (archaeological sites)
- Dúchas.ie (folklore records & oral history)
- OpenStreetMap & Wikidata (geological/topographical features)

A naive single-prompt LLM call produces generic hallucinations, misattributes folklore to the wrong townlands, and lacks spatial grounding. We require a system that:
1. Coordinates autonomous specialized tools (GeoScout, Etymology Sieve, Folklore Retriever).
2. Synthesizes an engaging, time-calibrated audio narration (30–45s).
3. Executes deterministic fact-checking and spatial verification loops before speech generation.

## Options Considered

### Option 1: Linear RAG Pipeline (Single Prompt with Injected Context)
* **Pros**: Simple to implement.
* **Cons**: Brittle when multiple disparate datasets conflict; no iterative retry if townland resolution fails; prone to LLM inventing historical trivia.

### Option 2: Autonomous ReAct Loop (LangChain Tool Agent)
* **Pros**: Flexible tool invocation.
* **Cons**: Non-deterministic execution paths; unbounded latency; high token cost; prone to getting stuck in tool execution loops during real-time driving.

### Option 3: LangGraph Cyclical State Machine — *Chosen*
* **Pros**:
  * **Explicit Graph Topology**: Fixed directed graph with state validation at each node (`GeoScoutNode` -> `ParallelEnrichmentNode` -> `SynthesizerNode` -> `VerifierNode`).
  * **Deterministic Guardrails**: The `VerifierNode` enforces structural schema validation (dates, distances, verified townland names). If a hallucination is flagged, it conditionally cycles back to the synthesizer with explicit feedback.
  * **Observability & Traceability**: Each state transition emits OpenTelemetry/Langfuse spans, allowing live visualization in our "Behind the Build" recruiter dashboard.
  * **Streaming Support**: Emits incremental state updates as each sub-agent completes its task.

## Decision
We select **LangGraph** to model the spatial enrichment pipeline as a stateful, cyclical graph with explicit verification guardrails.

## Consequences
* **Positive**: High factual accuracy, predictable token expenditure, and superior observability for engineering portfolio presentation.
* **Negative**: Requires formal state schema definitions (Pydantic / TypeScript types) and node transition logic.

