# resume-parsing - Test Checklist

## Behaviors to Test

### File Upload & Validation

- [ ] Uploading a PDF file triggers resume parsing and shows loading state
- [ ] Uploading a DOCX file triggers resume parsing and shows loading state
- [ ] Uploading a DOC file triggers resume parsing and shows loading state
- [ ] Uploading an unsupported file type (e.g., .txt, .jpg) displays user-friendly error message
- [ ] Uploading a file larger than 1MB displays "too large" error message
- [ ] Uploading an empty file displays "file is empty" error message
- [ ] Uploading a file with invalid magic bytes displays format mismatch error
- [ ] Uploading a file with an invalid filename displays filename error message

### R2 Storage

- [ ] Uploaded file is stored in R2 under `resumes/{uuid}/{filename}` path
- [ ] Response includes `resumeId` matching the R2 storage UUID
- [ ] R2 upload succeeds after PDF text extraction (buffer not detached)

### Text Extraction

- [ ] PDF text is extracted correctly using PDFParse
- [ ] DOCX text is extracted correctly using mammoth
- [ ] PDF extraction receives a buffer copy so the original ArrayBuffer stays usable for upload
- [ ] When text extraction fails, returns 400 with "Could not extract text from file"
- [ ] Client displays user-friendly message when text extraction fails

### LLM Resume Parsing

- [ ] Candidate name is extracted from resume text and returned in response
- [ ] Email address is extracted from resume text and returned in response
- [ ] Phone number is extracted (with country code if present) and returned in response
- [ ] Location is extracted and transformed to Address schema (country, countryCode, locality, region)
- [ ] Technical skills are extracted as string array from resume text
- [ ] Social profiles (GitHub, LinkedIn, Twitter, etc.) are extracted with kind and handle

### Skill Matching

- [ ] Extracted skill strings are matched against middleware API `/tags/match` endpoint
- [ ] Matched skills return as PopularTagItem objects with id, name, normalizedName
- [ ] When no skills are found in resume, empty skills array is returned
- [ ] When skill matching API fails, returns empty skills array (graceful degradation)

### Client Hook Integration

- [ ] Parsed resume data (resumeId, name, email, phone, address, skills, socials) is stored in onboarding state
- [ ] Matched skills are set as selected skills in onboarding store
- [ ] Removing uploaded file clears parsed resume data from store
- [ ] Removing uploaded file removes resume-sourced skills from selected skills

### Response Caching

- [ ] Re-uploading the same file returns cached response without re-parsing
- [ ] Different files produce fresh parsing results

### Rate Limiting

- [ ] Rapid sequential uploads trigger rate limit error (429) with user-friendly message
- [ ] Rate limit is IP-based using Upstash Redis sliding window (5 req / 15 min)

### Environment Validation

- [ ] Server fails to start if R2_ENDPOINT is missing or invalid URL
- [ ] Server fails to start if R2_ACCESS_KEY_ID is missing
- [ ] Server fails to start if R2_SECRET_ACCESS_KEY is missing
- [ ] Server fails to start if R2_BUCKET_NAME is missing
- [ ] Server fails to start if OPENAI_API_KEY is missing
- [ ] Server fails to start if UPSTASH_REDIS_REST_URL is missing or invalid URL
- [ ] Server fails to start if UPSTASH_REDIS_REST_TOKEN is missing
