# LLM Suggestion Object — Schema Design

## Design goals

1. **One LLM call → one response object** that contains everything the UI needs: the ranked suggestions, the steps under each one, and the exact KB articles / tickets that justify each suggestion (so "Referred KB Articles and Tickets" can be rendered *inside* each suggestion card, not just in a separate tab).
2. **Traceability** — every suggestion should point back to the source snippet(s) it was derived from. This lets agents (and you, during QA) verify the LLM isn't hallucinating, and lets you show "why" a suggestion was made.
3. **Feedback loop built in** — "That worked!" / "Didn't work" needs a place to land so you can (a) log it back to ServiceNow/analytics and (b) use it to re-rank or regenerate.
4. **Streaming-friendly** — since this triggers live on an Amazon Connect call, suggestions will likely regenerate as the transcript grows. The schema should support partial/incremental updates, not just one static blob.
5. **Confidence should be explainable**, not just a label — store the numeric score and the signal it came from, and pick a consistent formula across suggestions so "High/Medium/Low" always means the same thing.

---

## Top-level response object

```json
{
  "responseId": "sugg_8f3a1c2e",
  "contactId": "amzn-connect-contact-id-xyz",
  "clientId": "client_0042",
  "generatedAt": "2026-07-04T10:23:45Z",
  "triggerReason": "transcript_update",
  "triggerContext": {
    "transcriptSegmentId": "seg_0004",
    "detectedIntent": "password_reset",
    "keyEntities": ["employee_id", "login_failure"]
  },
  "suggestions": [ /* SuggestionObject[] — see below */ ],
  "metadata": {
    "modelVersion": "suggestion-engine-v1.3",
    "retrievalSet": "kb+tickets",
    "latencyMs": 812,
    "promptTokens": 2140,
    "completionTokens": 430
  }
}
```

| Field | Why it's there |
|---|---|
| `responseId` | Idempotency key; lets the frontend dedupe if the same suggestion set is pushed twice. |
| `contactId` | Ties the suggestion set back to the Amazon Connect call (for logging/QA/analytics). |
| `clientId` | Drives the context-aware KB/ticket scoping you mentioned. |
| `triggerReason` | `call_start`, `transcript_update`, `manual_refresh`, `agent_feedback` — useful for debugging *why* a new set was generated. |
| `triggerContext` | What in the transcript caused this generation — helpful for both debugging and for showing agents "based on: password reset" (like your mockup's blue banner). |
| `metadata` | Ops/observability — you'll want this once this is in production, even if the UI never shows it. |

---

## `SuggestionObject`

```json
{
  "suggestionId": "sugg_8f3a1c2e_1",
  "rank": 1,
  "title": "Password Reset Procedure",
  "category": "Authentication",
  "summary": "Guide the user to reset their password through the self-service portal.",
  "confidence": {
    "level": "High",
    "score": 0.91,
    "basis": "kb_match_and_ticket_precedent"
  },
  "detailedSteps": [
    { "stepNumber": 1, "instruction": "Navigate to portal.company.com" },
    { "stepNumber": 2, "instruction": "Click 'Forgot Password'" },
    { "stepNumber": 3, "instruction": "Enter employee ID and email" },
    { "stepNumber": 4, "instruction": "Follow email instructions" }
  ],
  "sources": {
    "knowledgeArticles": [ /* KBReference[] */ ],
    "previousTickets": [ /* TicketReference[] */ ]
  },
  "feedback": {
    "status": "pending",
    "submittedAt": null,
    "agentId": null
  }
}
```

| Field | Notes |
|---|---|
| `suggestionId` | Stable ID so a "Didn't work" click can reference the exact suggestion without resending the whole payload. |
| `rank` | Explicit ordering (don't rely on array order once you start patching individual suggestions). |
| `confidence.level` | Derived, not free-typed by the LLM — compute it in your backend from `score` using fixed thresholds (e.g. ≥0.8 High, 0.5–0.79 Medium, <0.5 Low) so it's consistent across calls and model versions. |
| `confidence.score` | Raw 0–1 value — keep this even though the UI only shows the label; you'll want it for ranking/sorting and for tuning thresholds later. |
| `confidence.basis` | One of a fixed enum (`kb_match_and_ticket_precedent`, `kb_match_only`, `ticket_precedent_only`, `llm_inference`) — tells you *why* it's confident, useful for QA and for an optional tooltip. |
| `detailedSteps` | Matches your "Show/Hide detailed steps" toggle directly. |
| `sources` | The KB articles and tickets that back *this specific suggestion* — see below. |
| `feedback` | Written back by the frontend when the agent clicks the thumbs buttons — see feedback flow below. |

---

## `KBReference`

```json
{
  "kbId": "KB0011",
  "title": "Password Reset - Self Service",
  "category": "Authentication",
  "url": "https://yourinstance.service-now.com/kb_view.do?sysparm_article=KB0011",
  "relevanceScore": 0.94,
  "matchedExcerpt": "Users can reset their own password via the self-service portal without agent intervention.",
  "viewCount": 1523,
  "lastUpdated": "2026-05-12"
}
```

- `matchedExcerpt` is the specific snippet the LLM actually used — critical for hallucination-checking and for a "why this article" hover state later.
- `relevanceScore` lets you sort/filter references within a suggestion, and lets you set a minimum-relevance cutoff so weak matches don't get surfaced.

## `TicketReference`

```json
{
  "ticketId": "INC0040213",
  "shortDescription": "User unable to log in after 3 failed attempts",
  "resolutionNotes": "Account was locked; unlocked via Active Directory and password reset.",
  "resolvedAt": "2026-04-02",
  "similarityScore": 0.87,
  "url": "https://yourinstance.service-now.com/incident.do?sys_id=..."
}
```

- Keep `resolutionNotes` short (this is what actually earns its place in the suggestion — the fact that a similar ticket was resolved this way is the whole value-add over a generic KB match).
- `similarityScore` — however you compute similarity (embedding cosine similarity, ServiceNow's own similarity search, etc.) — lets you decide a cutoff for "is this ticket actually relevant enough to show."

---

## Feedback write-back (agent clicks thumbs up/down)

Rather than re-sending the whole suggestion object, send a small delta back to your backend:

```json
{
  "contactId": "amzn-connect-contact-id-xyz",
  "suggestionId": "sugg_8f3a1c2e_1",
  "feedback": "worked",
  "agentId": "agent_0007",
  "timestamp": "2026-07-04T10:24:10Z"
}
```

Two things worth deciding now, since they affect the schema:

1. **Does "Didn't work" trigger regeneration?** If yes, your backend needs to treat this as a new `triggerReason: "agent_feedback"` and exclude/deprioritize the rejected suggestion's sources on the next call — otherwise the LLM will likely just suggest the same thing again.
2. **Where does feedback get persisted?** If you're writing it back into ServiceNow (e.g. as a note on the incident, or into a custom table used to improve future retrieval), that's a separate downstream write, not something the LLM needs to know about — but worth deciding before backend work starts, since it affects whether `ticketId`/`kbId` need to be ServiceNow sys_ids or just display numbers.

---

## TypeScript interfaces (for the frontend)

```typescript
interface SuggestionResponse {
  responseId: string;
  contactId: string;
  clientId: string;
  generatedAt: string; // ISO 8601
  triggerReason: 'call_start' | 'transcript_update' | 'manual_refresh' | 'agent_feedback';
  triggerContext: {
    transcriptSegmentId: string;
    detectedIntent: string;
    keyEntities: string[];
  };
  suggestions: Suggestion[];
  metadata: {
    modelVersion: string;
    retrievalSet: string;
    latencyMs: number;
    promptTokens: number;
    completionTokens: number;
  };
}

interface Suggestion {
  suggestionId: string;
  rank: number;
  title: string;
  category: string;
  summary: string;
  confidence: {
    level: 'High' | 'Medium' | 'Low';
    score: number; // 0-1
    basis: 'kb_match_and_ticket_precedent' | 'kb_match_only' | 'ticket_precedent_only' | 'llm_inference';
  };
  detailedSteps: { stepNumber: number; instruction: string }[];
  sources: {
    knowledgeArticles: KBReference[];
    previousTickets: TicketReference[];
  };
  feedback: {
    status: 'pending' | 'worked' | 'didnt_work';
    submittedAt: string | null;
    agentId: string | null;
  };
}

interface KBReference {
  kbId: string;
  title: string;
  category: string;
  url: string;
  relevanceScore: number;
  matchedExcerpt: string;
  viewCount?: number;
  lastUpdated?: string;
}

interface TicketReference {
  ticketId: string;
  shortDescription: string;
  resolutionNotes: string;
  resolvedAt?: string;
  similarityScore: number;
  url: string;
}
```

---

## A few backend decisions this schema forces you to make early

- **Confidence thresholds** — pick the 0.8 / 0.5 cutoffs (or whatever) once, and compute the label server-side rather than asking the LLM to self-report "High/Medium/Low" directly. LLMs are inconsistent at self-rating confidence; a score derived from retrieval-match strength + historical feedback success rate will be far more reliable and tunable.
- **Minimum relevance cutoff** for sources — decide whether a suggestion with no KB/ticket backing (`sources` empty, `basis: "llm_inference"`) should even be shown, or suppressed. Given this is a regulated service-desk context, you probably want to suppress pure-inference suggestions or clearly flag them as such.
- **Incremental updates** — as the transcript grows, do you want the LLM to return the *full* suggestion list each time, or a diff (new suggestions added, existing ones re-ranked, one removed)? Full-list-every-time is simpler to implement; a diff format saves tokens/latency but adds complexity on both ends. For a v1, I'd start with full-list-every-time and optimize later if latency becomes a problem.
- **Response format enforcement** — since you're parsing this from an LLM, use your model provider's structured output / tool-use (JSON schema) mode rather than parsing free text, so you get guaranteed valid JSON matching this shape.

Happy to help draft the actual JSON Schema (for structured-output enforcement) or sketch the API contract between your backend and the Amazon Connect/transcript pipeline next, if useful.
