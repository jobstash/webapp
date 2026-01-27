# fix-remote-location-jsonld - Test Checklist

## Behaviors to Test

### extractApplicantLocationRequirements

- [ ] Returns null when addresses is undefined
- [ ] Returns null when addresses is null
- [ ] Returns null when addresses is empty array
- [ ] Returns null when no addresses have isRemote: true
- [ ] Returns array of Country objects for addresses with isRemote: true
- [ ] Deduplicates countries when multiple addresses share the same country
- [ ] Each Country object has "@type": "Country" and "name" properties

### extractJobLocationType

- [ ] Returns "TELECOMMUTE" when any address has isRemote: true
- [ ] Returns "TELECOMMUTE" when workMode tag label contains "remote"
- [ ] Returns "TELECOMMUTE" when workMode tag label contains "hybrid"
- [ ] Returns "TELECOMMUTE" when location tag label is exactly "Remote"
- [ ] Returns null for on-site positions (no remote indicators)

### JobPostingSchema Integration

- [ ] Schema includes jobLocationType: "TELECOMMUTE" for remote jobs
- [ ] Schema includes applicantLocationRequirements for TELECOMMUTE jobs with remote addresses
- [ ] Schema omits applicantLocationRequirements when no remote addresses exist
- [ ] Schema omits jobLocationType for non-remote jobs
