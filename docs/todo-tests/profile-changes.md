# profile-changes - Test Checklist

## Behaviors to Test

### Contacts Editor — LinkedIn Required

- [ ] Opening "Edit Contacts" dialog shows "LinkedIn is required. Add your social profiles." as the description
- [ ] LinkedIn pill appears as the first pill in the picker
- [ ] LinkedIn pill displays a red asterisk (`*`) indicator in both selected and unselected states
- [ ] Clicking Save without selecting LinkedIn shows error: "LinkedIn profile is required."
- [ ] Clicking Save after selecting LinkedIn but leaving the handle empty shows error: "LinkedIn profile is required."
- [ ] Clicking Save with a valid LinkedIn handle saves successfully and closes the dialog
- [ ] Other fields (Website, Twitter, Telegram, etc.) remain optional — saving with only LinkedIn succeeds
- [ ] Error message clears when the dialog is reopened

### Profile Strength — Contacts Step

- [ ] Profile strength card shows "Add your contacts" as the next step when LinkedIn is not in the showcase
- [ ] After saving a LinkedIn handle, the "Add your contacts" step resolves and completedCount increments
- [ ] Profile shows "All-Star" tier when LinkedIn and all other 3 steps (resume, skills, linked account) are complete
- [ ] Having only Website or Lens in contacts (no LinkedIn) does NOT satisfy the contacts step

### Farcaster — Hidden

- [ ] Farcaster pill does not appear in the contacts editor pill list
- [ ] Farcaster does not appear in the linked accounts section
