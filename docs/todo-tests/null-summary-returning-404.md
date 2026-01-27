# null-summary-returning-404 - Test Checklist

## Behaviors to Test

- [ ] `dtoToJobListItem` returns fallback summary "{OrgName} is looking for a {Title}." when summary is null/empty
- [ ] `dtoToJobListItem` returns fallback summary "Apply for {Title} position." when org name is missing
- [ ] `dtoToJobListItem` preserves original summary when provided
- [ ] Job list renders successfully when API returns jobs with empty string summaries
- [ ] Job list renders successfully when API returns jobs with null summaries
- [ ] Page does not return 404 when job summary is empty string in API response
