# bug-fixes - Test Checklist

## Behaviors to Test

### Clear All Skills

- [ ] Removing all skills one-by-one in the Edit Skills dialog and saving clears the skills section
- [ ] Skills section shows empty state after saving with no skills selected
- [ ] Saving with an empty skills list does not retain previously saved skills on page refresh
- [ ] Saving with at least one skill still syncs correctly (regression check)

### Pagination Scroll-to-Top

- [ ] Navigating to the next page of job listings scrolls the page to the top of the job list
- [ ] Navigating to the previous page of job listings scrolls the page to the top of the job list
- [ ] Clicking a job card link does NOT trigger an unwanted scroll-to-top
- [ ] Clicking navigation links (e.g., logo, profile) does NOT trigger an unwanted scroll-to-top
- [ ] Pagination scroll-to-top works correctly on iOS Safari
- [ ] Using the browser back/forward buttons after paginating scrolls to the top of the job list
- [ ] Directly visiting a paginated URL (e.g., `?page=3`) scrolls to the top of the job list on load
