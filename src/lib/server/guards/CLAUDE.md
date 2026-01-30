# Guards

Server-side request guards for the resume parse endpoint. Each guard returns `Response | null` — a response short-circuits the request, `null` passes.

## Core Pattern

| Export        | File               | Purpose                                          |
| ------------- | ------------------ | ------------------------------------------------ |
| `GuardResult` | `types.ts`         | `Response \| null`                               |
| `GuardFn`     | `types.ts`         | `() => GuardResult \| Promise<GuardResult>`      |
| `guardError`  | `types.ts`         | `(message, status) => Response` helper           |
| `runGuards`   | `run-guards.ts`    | Runs guards sequentially, returns first non-null |
| `getClientIp` | `get-client-ip.ts` | Extracts IP from `x-forwarded-for` / `x-real-ip` |

## Guards

| Guard            | File                    | Function                                                  | Checks                                                  | Failure                 |
| ---------------- | ----------------------- | --------------------------------------------------------- | ------------------------------------------------------- | ----------------------- |
| Origin           | `origin-guard.ts`       | `checkOrigin(request)`                                    | CORS origin/referer vs `FRONTEND_URL`                   | 403                     |
| Rate Limit       | `rate-limiter.ts`       | `checkRateLimit(ip)`                                      | 5 req / 15 min per IP                                   | 429 + `Retry-After`     |
| Concurrent Limit | `concurrent-limiter.ts` | `acquireConcurrentSlot(ip)` / `releaseConcurrentSlot(ip)` | Max 2 concurrent per IP                                 | 429                     |
| Filename         | `filename-guard.ts`     | `checkFilename(filename)`                                 | Non-empty, length ≤ 255, no null bytes / path traversal | 400                     |
| Magic Bytes      | `magic-bytes-guard.ts`  | `checkMagicBytes(buffer)`                                 | PDF / DOC / DOCX signatures                             | 400                     |
| File Hash Cache  | `file-hash-cache.ts`    | `computeFileHash` / `getCachedResult` / `setCachedResult` | SHA-256 dedup, LRU max 100                              | Returns cached response |

## Execution Strategy

Guards run in ordered phases — cheapest checks first, before reading the request body.

```
Phase 1: Pre-body (origin → rate limit → concurrent slot)
Phase 2: Parse form data
Phase 3: File validation (filename → magic bytes)
Phase 4: Deduplication (hash cache)
Phase 5: Processing
Finally: releaseConcurrentSlot
```

`acquireConcurrentSlot` and `releaseConcurrentSlot` form a pair — the slot is always released in a `finally` block.

## Consumers

- `src/app/api/onboarding/resume/parse/route.ts` — the `POST` handler composes all guards.

## Testing

- Tests live in `__tests__/` — one file per guard
- Each stateful module exports a `_reset*` function for test isolation
- Tests verify both pass (`null`) and fail (`Response` with correct status/body) paths
