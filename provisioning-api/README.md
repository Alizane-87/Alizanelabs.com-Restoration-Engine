# Onboarding Data Extraction & Provisioning API

Backend for Alizane Labs' white-glove onboarding. The onboarding AI voice agent interviews a
new client; GoHighLevel posts the transcript here; this service turns it into structured
business facts and **stages them for human verification**. Nothing is published to a client's
live chatbot automatically.

```
GHL workflow ──webhook──▶ /api/webhooks/ghl/onboarding-complete
                              │ verify HMAC, size, rate limit, schema, idempotency
                              ├─▶ 202 Accepted (immediately)
                              └─▶ after(): extract with gpt-4o-mini
                                          ├─▶ Google Sheet row  (status PENDING_REVIEW)
                                          └─▶ Slack notification

CEO reviews ──▶ POST /api/staging/{recordId}/approve  ──▶ status APPROVED + verified JSON
                                                          (publishing stays manual)
```

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/webhooks/ghl/onboarding-complete` | HMAC-SHA256 signature | Ingest a completed onboarding interview |
| `GET` | `/api/staging/{recordId}` | `Authorization: Bearer $APPROVAL_API_TOKEN` | Read one staged record |
| `POST` | `/api/staging/{recordId}/approve` | `Authorization: Bearer $APPROVAL_API_TOKEN` | Mark a record verified |
| `GET` | `/api/health` | none | Configuration readiness (no secrets) |

### Webhook contract

Sign the **raw request body** with `GHL_WEBHOOK_SECRET` (HMAC-SHA256, hex or base64) and send it
in `x-ghl-signature`, `x-webhook-signature`, or `x-hub-signature-256`; a `sha256=` prefix is
accepted. If you also send `x-ghl-timestamp`, the signature may be computed over
`<timestamp>.<body>` and deliveries older than 5 minutes are rejected as replays.

The payload is tolerant of GHL's varying shapes — unknown fields pass through, and the
transcript may be a string or an array of turns (`role`/`speaker` + `text`/`message`/`content`)
under either `transcript` or `callTranscript`. Only a transcript is strictly required.
`eventId`, falling back to `id` then `callId`, is the idempotency key: a redelivery returns
`200 {"status":"duplicate_ignored"}` without a second LLM call.

Responses: `202` accepted, `200` duplicate, `400` bad JSON, `401` bad signature, `413` oversized,
`422` schema/transcript problem, `429` rate limited.

### Approving

```bash
curl -X POST "$BASE/api/staging/stg_123/approve" \
  -H "authorization: Bearer $APPROVAL_API_TOKEN" \
  -H "content-type: application/json" \
  -d '{"approvedBy":"ceo@alizanelabs.site","acknowledgeFlags":false}'
```

Approval is the only transition out of `PENDING_REVIEW` and it returns the verified facts so
they can be pushed live. A record carrying high-severity flags is rejected with `409` until the
call is re-sent with `"acknowledgeFlags": true`; re-approving an already-approved record is a
`409` too.

## Why the extraction is paranoid

The model is told to return `null` for anything the client did not say, and every price, plus
hours, service area, emergency and booking policy, must carry a **verbatim `sourceQuote` from
the transcript**. `deriveReviewFlags()` then converts the extraction into a reviewer checklist:
a price with no quote, an emergency promise with no quote, missing hours, an open day with no
opening time, a missing timezone, or unanswered interview questions all become flags, with
high-severity ones blocking one-click approval. A price that was never mentioned is *not* a
flag — it is simply `null`, which is the correct answer.

If extraction fails entirely, the interview is still staged as `EXTRACTION_FAILED` with a
high-severity flag, so a failed call surfaces to a human rather than disappearing.

## Configuration

Copy `.env.example` and fill it in. Required: `GHL_WEBHOOK_SECRET`, `APPROVAL_API_TOKEN`,
`OPENAI_API_KEY`. At least one staging sink must be configured (Google Sheets, Slack, or both) —
the service refuses to start otherwise, since a record with nowhere to go is a lost onboarding.

- **Google Sheets**: share the staging spreadsheet with the service account email as an Editor.
  Put the private key in `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` with literal `\n` escapes, or
  base64-encode the whole key. The first row is treated as data, so add the header row yourself
  (column order is `STAGING_COLUMNS` in `src/lib/staging/record.ts`, and it is append-only —
  never reorder it while records are live).
- **Slack**: `SLACK_WEBHOOK_URL` — the message includes extracted prices and high-severity flags.
- **Upstash Redis** (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`): optional but
  recommended. Idempotency and rate limiting fall back to per-instance memory, which is
  best-effort on serverless — two concurrent retries landing on different instances can both be
  processed.

## Deploying to Vercel

Set the project's **Root Directory** to `provisioning-api`, add the environment variables, and
deploy. The webhook route runs on the Node.js runtime with `maxDuration = 60` so the extraction
started in `after()` has room to finish after the 202 is returned.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest
npm run lint
npm run typecheck
npm run build
```

Tests cover signature verification and replay windows, transcript flattening, the review-flag
rules, the JSON-schema/zod drift guard, both routes (including auth, duplicates, rate limiting
and oversized bodies), the extraction failure paths, sink fan-out, and log redaction. They stub
the OpenAI client and Sheets/Slack, so no credentials or network access are needed.

## Not built here

The custom outbound telephony stack (Twilio + Retell AI initiating onboarding calls) is
deliberately absent — per instruction it is only built if GHL's native outbound voice proves
unreliable. Publishing approved facts into the live chatbot is also intentionally out of scope:
`/approve` returns the verified JSON and records who approved it, and the push stays manual
until there is a publish adapter to review.
