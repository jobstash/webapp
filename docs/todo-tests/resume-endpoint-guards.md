# resume-endpoint-guards - Test Checklist

## Behaviors to Test

### Server Guards (unit)

- [ ] Origin guard passes requests with matching `origin` header
- [ ] Origin guard passes requests with matching `referer` header
- [ ] Origin guard rejects requests with mismatched `origin` (403)
- [ ] Origin guard skips check in development mode
- [ ] Rate limiter allows up to 5 requests per IP within 15 minutes
- [ ] Rate limiter returns 429 with `Retry-After` header on 6th request
- [ ] Rate limiter tracks IPs independently
- [ ] Concurrent limiter allows up to 2 simultaneous requests per IP
- [ ] Concurrent limiter returns 429 when a 3rd concurrent request arrives
- [ ] Concurrent limiter releases slot correctly after request completes
- [ ] Filename guard rejects empty filename (400)
- [ ] Filename guard rejects filenames longer than 255 characters (400)
- [ ] Filename guard rejects filenames with null bytes (400)
- [ ] Filename guard rejects path traversal (`..`, `/`, `\`) (400)
- [ ] Filename guard passes valid filenames
- [ ] Magic bytes guard accepts valid PDF file signatures
- [ ] Magic bytes guard accepts valid DOC file signatures
- [ ] Magic bytes guard accepts valid DOCX file signatures
- [ ] Magic bytes guard rejects files with unrecognized signatures (400)
- [ ] Magic bytes guard rejects files smaller than 4 bytes (400)
- [ ] File hash cache returns cached response for duplicate file uploads
- [ ] File hash cache evicts oldest entry when LRU limit (100) is reached
- [ ] `runGuards` returns first non-null guard result
- [ ] `runGuards` returns null when all guards pass

### Route Handler (integration)

- [ ] POST returns 400 for invalid form data
- [ ] POST returns 400 for missing file
- [ ] POST returns 400 for unsupported MIME type
- [ ] POST returns 400 for empty file (0 bytes)
- [ ] POST returns 400 for file exceeding 10MB
- [ ] POST returns 200 with `fileName` and `skills` array on valid upload
- [ ] POST releases concurrent slot even on error (finally block)
- [ ] POST returns cached response for duplicate file content

### Client Validation (use-resume-step)

- [ ] Rejects files with non-PDF/DOC/DOCX MIME type before network call
- [ ] Rejects files larger than 10MB before network call
- [ ] Displays user-friendly error for each server error message
- [ ] Falls back to generic error for unknown server errors
- [ ] Clears previous error when user selects a new file
- [ ] Resets file state on server error
- [ ] Resets file state on network error

### UI (resume-step)

- [ ] Displays `FieldError` with error message when error state is set
- [ ] Displays `FieldDescription` when no error is present
- [ ] Shows "Reading your resume..." during parsing
- [ ] Shows skill count with checkmark icon after successful parse
- [ ] Shows default description when no file is selected
- [ ] Drop zone accepts drag-and-drop file upload
- [ ] File input opens on click when no file is present
- [ ] Remove button clears file, resets input, and removes resume skills
