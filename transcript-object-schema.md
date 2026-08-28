# Live Transcript Object — Schema Design

## Design goals

1. **Streaming, not one-shot.** Amazon Connect (via Amazon Transcribe / Contact Lens real-time streaming) delivers speech as a series of **partial results that get corrected into a final result** as the ASR engine gains confidence. Your UI needs to show text appearing live and then "settling," similar to how live captions behave — not just a static list that appears once.
2. **Ordering must survive network jitter.** Partial updates for the same utterance can arrive out of order relative to segments. Each segment needs a stable ID + sequence number so the frontend can patch the right line rather than appending duplicates.
3. **This object is also the input to the Suggestions engine.** Your suggestion object's `triggerContext.transcriptSegmentId` needs something concrete to point at — so segment IDs need to be stable and referenceable, not just array indices.
4. **Quick-response buttons are configuration, not transcript data** — worth modeling separately so they don't get tangled with the live feed.

---

## Top-level session object

Created once, at `triggerReason: "call_start"`, and updated in place for the duration of the call.

```json
{
  "contactId": "amzn-connect-contact-id-xyz",
  "clientId": "client_0042",
  "channel": "voice",
  "status": "active",
  "startedAt": "2026-07-04T10:23:10Z",
  "endedAt": null,
  "participants": [
    { "participantId": "p_agent", "role": "AGENT", "displayName": "Tina" },
    { "participantId": "p_customer", "role": "CUSTOMER", "displayName": "Customer" }
  ],
  "segments": [ /* TranscriptSegment[] — see below, append-only + patchable */ ],
  "lastUpdatedAt": "2026-07-04T10:23:42Z"
}
```

| Field | Notes |
|---|---|
| `status` | `active`, `ended`, `disconnected` — drives whether "Live transcription active…" shows, and whether quick-responses like "In case of disconnect" should be surfaced. |
| `participants` | Amazon Connect/Transcribe gives you channel-based speaker separation (agent channel vs. customer channel on the call), so this is usually just two entries for a simple voice call — but keep it as an array in case you ever add supervisor barge-in or conferencing. |
| `segments` | The live feed itself. Append-only for new utterances, but **existing entries get patched in place** while `isPartial: true` (see below). |

---

## `TranscriptSegment`

This is the core unit — one per speaker utterance.

```json
{
  "segmentId": "seg_0004",
  "sequence": 4,
  "speaker": "CUSTOMER",
  "text": "Sure, it's EMP-4729",
  "startTime": "2026-07-04T10:23:42Z",
  "endTime": "2026-07-04T10:23:44Z",
  "isPartial": false,
  "asrConfidence": 0.93,
  "sentiment": "NEUTRAL"
}
```

| Field | Notes |
|---|---|
| `segmentId` | Stable ID for this utterance. Referenced by the Suggestions object's `triggerContext.transcriptSegmentId`, and used by the frontend to know *which* line to update vs. append. |
| `sequence` | Monotonically increasing integer — the frontend should sort/render by this, not by arrival order, since partial-then-final updates for the same segment can arrive close together but the *next* segment's partials might interleave. |
| `speaker` | `AGENT` \| `CUSTOMER` (matches `participants[].role`). |
| `isPartial` | **This is the important one.** `true` while Transcribe is still refining the utterance (text may still change); `false` once finalized. The frontend can render partial text in a lighter/italic style, the way live captions do, then "commit" it visually when final. |
| `asrConfidence` | Amazon Transcribe returns this per-item; useful if you ever want to flag low-confidence transcription (e.g., gray out or flag a segment the agent should double check, like a spoken employee ID). |
| `sentiment` | Optional — only populate this if you turn on Contact Lens real-time sentiment analysis. Worth stubbing in now even if unused at first, since it's a common next step (e.g., visually flagging a frustrated customer). |

### Why split partial/final instead of just appending finished lines?

Two options, worth deciding deliberately:

- **Option A (recommended): patch-in-place.** The frontend keeps a map of `segmentId → segment`, and every update (partial or final) replaces that entry. This gives you the "live typing" feel your mockup's "Live transcription active…" indicator implies, and matches how Transcribe's streaming API actually emits events.
- **Option B: only show final segments.** Simpler, but loses the live feel and adds latency (the agent won't see anything until Transcribe finalizes a chunk, which can be a second or two behind real speech).

Given you already have a "Live transcription active…" affordance in the mockup, Option A is the better match.

---

## Delta/event format (what actually comes over the wire)

Rather than re-sending the whole `segments` array on every update (expensive over a live call), send small events and let the frontend reduce them into the session object:

```json
{
  "type": "segment_update",
  "contactId": "amzn-connect-contact-id-xyz",
  "segment": {
    "segmentId": "seg_0004",
    "sequence": 4,
    "speaker": "CUSTOMER",
    "text": "Sure, it's EMP-47",
    "startTime": "2026-07-04T10:23:42Z",
    "endTime": null,
    "isPartial": true,
    "asrConfidence": 0.71
  }
}
```

Event types worth defining:

| `type` | When it fires |
|---|---|
| `session_start` | Call connects — creates the session object. |
| `segment_update` | Every partial or final update to an utterance (frontend upserts by `segmentId`). |
| `session_end` | Call disconnects — sets `status: "ended"`, `endedAt`. |

This also maps cleanly onto whatever transport you use to push updates to the frontend (WebSocket, SSE, or Amazon Connect's own streaming API/Kinesis pipeline) — one small JSON event per ASR update rather than a growing blob.

---

## Quick-response buttons (separate, static object)

These aren't transcript data — they're agent-facing macros — so keep them out of the live feed entirely. A simple config object, likely fetched once per call (or even app-wide) rather than streamed:

```json
{
  "quickResponses": [
    { "id": "qr_hello", "label": "Hello", "text": "Hello! Thanks for reaching out..." },
    { "id": "qr_one_moment", "label": "One moment", "text": "One moment please while I look into this." },
    { "id": "qr_disconnect", "label": "In case of disconnect", "text": "If we get disconnected, I'll call you back at..." },
    { "id": "qr_not_responding", "label": "User not responding", "text": "..." },
    { "id": "qr_check_colleagues", "label": "Check with colleagues", "text": "..." },
    { "id": "qr_goodbye_survey", "label": "Goodbye + Survey", "text": "...", "highlighted": true },
    { "id": "qr_goodbye", "label": "Goodbye", "text": "..." }
  ]
}
```

`highlighted` covers the "Goodbye + Survey" button that's visually emphasized (filled blue) in your mockup — probably your recommended default closing action.

---

## TypeScript interfaces

```typescript
interface TranscriptSession {
  contactId: string;
  clientId: string;
  channel: 'voice' | 'chat';
  status: 'active' | 'ended' | 'disconnected';
  startedAt: string;
  endedAt: string | null;
  participants: Participant[];
  segments: TranscriptSegment[];
  lastUpdatedAt: string;
}

interface Participant {
  participantId: string;
  role: 'AGENT' | 'CUSTOMER';
  displayName: string;
}

interface TranscriptSegment {
  segmentId: string;
  sequence: number;
  speaker: 'AGENT' | 'CUSTOMER';
  text: string;
  startTime: string;
  endTime: string | null;
  isPartial: boolean;
  asrConfidence: number;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

type TranscriptEvent =
  | { type: 'session_start'; session: TranscriptSession }
  | { type: 'segment_update'; contactId: string; segment: TranscriptSegment }
  | { type: 'session_end'; contactId: string; endedAt: string };

interface QuickResponse {
  id: string;
  label: string;
  text: string;
  highlighted?: boolean;
}
```

---

## How this ties back to the Suggestions object

Your suggestion engine should trigger off `segment_update` events where `isPartial: false` (don't burn LLM calls re-generating suggestions on every partial ASR correction — only on finalized utterances, and probably debounced/batched every N finalized segments or M seconds). The `triggerContext.transcriptSegmentId` in the suggestions object should reference the `segmentId` of the finalized segment that caused the regeneration, so you can always answer "what did the customer say that led to this suggestion."

A couple of decisions this forces:

- **Debounce strategy** — regenerate suggestions on every single finalized segment (simplest, but can spam suggestions), or batch every few seconds / after a full "turn" (agent finishes speaking, customer finishes speaking)? I'd start with "after each finalized customer utterance" since that's usually where new problem-relevant info appears.
- **Partial-segment display without partial-triggered suggestions** — make sure your frontend renders partials for the UX feel, but your event consumer for the suggestion engine filters strictly to `isPartial: false`.
