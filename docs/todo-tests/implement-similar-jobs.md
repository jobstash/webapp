# implement-similar-jobs - Test Checklist

## Behaviors to Test

### fetchSimilarJobs - API Integration

- [ ] Returns an empty array when called with an empty id string
- [ ] Fetches from the correct URL using the pattern `/jobs/similar/{encodedId}`
- [ ] Encodes the job id in the URL to handle special characters
- [ ] Uses `force-cache` strategy with a 1-hour revalidation interval
- [ ] Returns an empty array when the HTTP response status is not ok (e.g. 500)
- [ ] Returns an empty array when the response JSON fails Zod validation
- [ ] Returns an empty array when the API response has `success: false`
- [ ] Returns the parsed data array when the API response has `success: true`
- [ ] Returns an empty array when the fetch throws a network error
- [ ] Logs an error to console on HTTP failure, validation failure, API failure, and network error

### dtoToSimilarJob - DTO Transformation

- [ ] Maps `shortUUID` to a unique `id` combining shortUUID and normalizedName when organization has normalizedName
- [ ] Uses only `shortUUID` as `id` when organization has no normalizedName
- [ ] Uses the DTO `title` directly when it is a non-empty string
- [ ] Generates a fallback title `"Role at {orgName}"` when title is null and organization name exists
- [ ] Generates a fallback title `"Open Role"` when both title and organization name are null
- [ ] Constructs the `href` by slugifying the title and orgName with the shortUUID suffix
- [ ] Includes the organization name slug segment in `href` when organization exists
- [ ] Omits the organization name slug segment from `href` when organization is null
- [ ] Transforms `timestamp` number into a human-readable `timestampText` string via `prettyTimestamp`
- [ ] Sets `companyName` to the organization name when organization exists
- [ ] Sets `companyName` to null when organization is null
- [ ] Derives `companyLogo` from organization website and logoUrl via `getLogoUrl` when organization exists
- [ ] Sets `companyLogo` to null when organization is null

### dtoToJobDetails - Similar Jobs Integration

- [ ] Includes a `similarJobs` array in the returned JobDetailsSchema
- [ ] Maps each SimilarJobItemDto in the array through `dtoToSimilarJob`
- [ ] Defaults `similarJobs` to an empty array when no similarJobsDto argument is provided
- [ ] Preserves all base job details fields alongside the similarJobs array

### fetchJobDetails - Orchestration

- [ ] Calls `fetchSimilarJobs` with the same job id after successfully fetching job details
- [ ] Passes the fetched similar jobs array to `dtoToJobDetails`
- [ ] Returns job details with similar jobs populated when both fetches succeed
- [ ] Returns job details with an empty similarJobs array when fetchSimilarJobs returns empty

### SimilarJobItem - UI Rendering

- [ ] Renders the job title text inside the link
- [ ] Renders the company logo image when `companyLogo` is a valid URL
- [ ] Renders a fallback div with the first letter of `companyName` uppercased when logo is missing or fails to load
- [ ] Renders a `"?"` character in the fallback when both companyLogo and companyName are null
- [ ] Displays the subtitle as `"{companyName} · {timestampText}"` when companyName is present
- [ ] Displays the subtitle as only `"{timestampText}"` when companyName is null
- [ ] Navigates to the job's `href` when the link is clicked
- [ ] Applies hover background styling on mouse over

### SimilarJobsCard - Container Rendering

- [ ] Renders nothing (returns null) when the jobs array is empty
- [ ] Renders a card with the heading "Similar Jobs" when jobs array is non-empty
- [ ] Renders one SimilarJobItem for each job in the array
- [ ] Uses `job.id` as the React key for each rendered SimilarJobItem
- [ ] Constrains the job list to a max height of 400px with vertical scroll overflow

### JobDetailsSidebar - Integration

- [ ] Renders the SimilarJobsCard component with the `similarJobs` from job details
- [ ] Positions the SimilarJobsCard after the OrgInfoCard in the sidebar layout
- [ ] Hides the similar jobs section entirely when the similarJobs array is empty
