# API

All endpoints return the same envelope:

```ts
{ success: true,  message: string, data: T }
{ success: false, message: string, errors?: Record<string, string[]> }   // field → messages
```

Messages are written for visitors; stack traces, SQL or internals are never returned.

---

## `POST /api/inquiries`

Submit a project inquiry (the contact form).

**Request** — JSON, ≤ 16 KB. Optional header `Idempotency-Key: <uuid>` makes retries safe.

| Field      | Rules                                                                          |
| ---------- | ------------------------------------------------------------------------------ |
| `name`     | required, 2–80 chars                                                           |
| `email`    | required, valid address, ≤ 160 chars (lower-cased)                             |
| `company`  | optional, ≤ 120 chars                                                          |
| `phone`    | optional, 7–24 chars of digits, spaces, `+ ( ) . -`                            |
| `interest` | required: `ai-ml` · `genai` · `data` · `software` · `cloud` · `team` · `other` |
| `message`  | required, 10–2000 chars                                                        |
| `consent`  | must be `true`                                                                 |
| `website`  | **honeypot** — must be empty or absent                                         |

The same schema (`src/lib/validations/inquiry.schema.ts`) runs in the browser and on the server.
After validation, control characters are stripped and whitespace is normalised; the email template
escapes everything again.

**Responses**

| Status | Meaning                                                                                |
| ------ | -------------------------------------------------------------------------------------- |
| `201`  | `{ id, delivery }` — `delivery` is `"sent"` or `"demo"` (no email provider configured) |
| `400`  | invalid JSON or failed validation (`errors` lists fields)                              |
| `413`  | body too large                                                                         |
| `429`  | rate limited (`Retry-After` header) — default 5 per IP per 10 minutes                  |
| `502`  | the team could not be notified — retry (the same idempotency key is safe)              |
| `500`  | unexpected error (logged server-side, nothing leaked)                                  |

Behaviour notes: bots that fill the honeypot are rejected by validation; repeated submissions with the
same `Idempotency-Key` return the original receipt and notify only once; failures are never cached.

## `GET /api/health`

Liveness probe: `{ success: true, data: { status: "ok", emailConfigured: boolean } }`.
Always dynamic (`Cache-Control: no-store`). Reports **booleans only** — never secret values.

## Non-API routes

`/sitemap.xml`, `/robots.txt` (disallows everything unless the deployment is production),
`/opengraph-image.png`, `/twitter-image.png`, and a friendly 404.
