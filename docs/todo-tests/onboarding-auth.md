# onboarding-auth - Test Checklist

## Behaviors to Test

### Header Auth Button

- [ ] Unauthenticated user sees "Get Started" button on desktop (lg+)
- [ ] Unauthenticated user sees User icon button on mobile
- [ ] Clicking "Get Started" opens the onboarding modal
- [ ] Authenticated user sees avatar/initial circle instead of "Get Started"
- [ ] Clicking avatar opens dropdown with "Profile" and "Log out" options
- [ ] Clicking "Profile" in dropdown navigates to /profile
- [ ] Clicking "Log out" clears session and shows "Get Started" again
- [ ] Loading state shows pulsing placeholder while auth resolves

### Onboarding Modal

- [ ] Modal opens as full-screen overlay when triggered
- [ ] Modal displays 3-dot step indicator for onboarding steps
- [ ] Step indicator highlights current step with primary color
- [ ] Close (X) button closes the modal and resets all state
- [ ] Clicking backdrop closes the modal

### Welcome Step

- [ ] Displays "JobStash" brand name with gradient styling
- [ ] Displays "Find Your Next Web3 Role" headline
- [ ] Displays setup profile subtext
- [ ] Clicking "Let's Go" advances to Resume & Skills step
- [ ] Clicking "Log in" switches to Login view
- [ ] Step indicator shows first dot as active

### Resume & Skills Step

- [ ] Displays "Upload Your Resume" section with optional label
- [ ] Drag and drop zone renders with dashed border
- [ ] Dragging a file over the zone highlights the border
- [ ] Dropping a valid file (.pdf, .doc, .docx) triggers resume parsing
- [ ] "Browse files" button opens file picker dialog
- [ ] Selected file name displays with remove (X) button
- [ ] Loading spinner shows while resume is being parsed
- [ ] Parsed skills auto-populate the selected skills section
- [ ] Removing uploaded file clears file and parsed resume data
- [ ] "Select Your Skills" section shows dynamic subtext based on resume state
- [ ] Selected skills display as removable Badge chips
- [ ] Clicking X on a skill removes it from selected
- [ ] Search input filters available skills by name
- [ ] Clicking an available skill adds it to selected
- [ ] Available skills exclude already-selected skills
- [ ] "Back" button returns to Welcome step
- [ ] "Continue" button advances to Connect step
- [ ] "Skip" link also advances to Connect step
- [ ] Continue is enabled even with no skills selected

### Connect Step

- [ ] Displays "Connect Your Account" headline and subtext
- [ ] Shows 4 auth buttons: Wallet, Email, Google, GitHub
- [ ] Each auth button shows its respective icon
- [ ] Clicking any auth button shows loading state ("Connecting...")
- [ ] All buttons are disabled while one is loading
- [ ] After successful auth, displays "Setting up your account..." overlay
- [ ] Successful auth exchanges token, submits onboarding data, closes modal, and redirects to /profile
- [ ] "Back" button returns to Resume & Skills step
- [ ] Back button is disabled during processing

### Login View

- [ ] Displays "Welcome Back" headline
- [ ] Displays "Log in to your JobStash account" subtext
- [ ] Shows same 4 auth buttons as Connect step
- [ ] Step indicator is hidden during login view
- [ ] Successful login exchanges token, closes modal, and redirects to /profile
- [ ] Login does NOT submit onboarding data (only auth exchange)
- [ ] "Back to onboarding" link returns to Welcome step
- [ ] Displays "Logging you in..." during processing

### Auth Provider

- [ ] Restores session from localStorage on mount if token exists
- [ ] Sets isLoading to true while restoring session
- [ ] Sets isLoading to false after restoration completes or fails
- [ ] Clears invalid token from localStorage if profile fetch fails
- [ ] login() stores session token in localStorage
- [ ] logout() removes token from localStorage and clears session state
- [ ] isAuthenticated is true when session exists, false otherwise
- [ ] submitOnboarding() sends skills and resume file name to mock API

### Onboarding Provider

- [ ] Initial state: modal closed, step is 'welcome', login view hidden
- [ ] open() sets isOpen to true
- [ ] close() resets all state to initial values
- [ ] nextStep() advances from welcome → resume-skills → connect
- [ ] prevStep() goes from connect → resume-skills → welcome
- [ ] nextStep() is no-op on last step (connect)
- [ ] prevStep() is no-op on first step (welcome)
- [ ] goToStep() navigates to any specific step
- [ ] setResumeFile() updates only the resumeFile in data
- [ ] setParsedResume() updates only the parsedResume in data
- [ ] setSelectedSkills() updates only the selectedSkills in data

### Profile Page

- [ ] Displays user name or "Anonymous User" if no name
- [ ] Displays email or "No email" if not available
- [ ] Displays auth method as a capitalized Badge
- [ ] Shows resume file name or "No resume uploaded"
- [ ] Shows skills as Badge chips
- [ ] Shows "No skills selected" if no skills
- [ ] "Log out" button clears session
- [ ] Redirects to / when not authenticated and not loading
- [ ] Shows skeleton loader while auth state is loading
- [ ] Page has correct metadata title "Your Profile | JobStash"

### Provider Integration

- [ ] AuthProvider wraps app with PrivyProvider
- [ ] OnboardingProvider wraps inside AuthProvider
- [ ] OnboardingModal renders globally inside OnboardingProvider
- [ ] Any component can trigger onboarding modal via useOnboarding().open()
