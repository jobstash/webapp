# null-summary-returning-404 - Test Checklist

## Behaviors to Test

- [ ] Job list renders successfully when API returns jobs with empty string summaries
- [ ] Job list renders successfully when API returns jobs with null summaries
- [ ] Jobs with empty/null summaries display fallback summary: "{OrgName} is looking for a {Title}."
- [ ] Jobs without organization name display fallback: "Apply for {Title} position."
- [ ] `nullableStringSchema` transforms empty strings to null
- [ ] `nullableStringSchema` preserves non-empty strings as-is
- [ ] `nullableStringSchema` preserves null values as null
- [ ] Page does not return 404 when job summary is empty string in API response
