#!/bin/bash
# worktree-dev.sh - Parallel feature development with git worktrees
# Usage: ./scripts/worktree-dev.sh "<description>"
#
# This script:
# 1. Auto-generates branch name from description (feat/, fix/, test/, etc.)
# 2. Creates a git worktree for isolated development
# 3. Launches Claude in the worktree (triggers brainstorm)
# 4. After Claude exits, cleans up the worktree
# 5. Returns to main repo and launches Claude with summary

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Validate arguments
if [ -z "$1" ]; then
  echo -e "${RED}Error: Description required${NC}"
  echo "Usage: ./scripts/worktree-dev.sh \"<description>\""
  echo ""
  echo "Examples:"
  echo "  ./scripts/worktree-dev.sh \"Add salary range filter\"        -> feat/add-salary-range-filter"
  echo "  ./scripts/worktree-dev.sh \"Fix login button not working\"   -> fix/login-button-not-working"
  echo "  ./scripts/worktree-dev.sh \"Add unit tests for auth hook\"   -> test/unit-tests-for-auth-hook"
  echo "  ./scripts/worktree-dev.sh \"Refactor job card component\"    -> refactor/job-card-component"
  exit 1
fi

DESCRIPTION="$1"
BASE_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Generate branch name from description
generate_branch_name() {
  local desc="$1"
  local desc_lower=$(echo "$desc" | tr '[:upper:]' '[:lower:]')
  local prefix="feat"

  # Determine prefix based on keywords in description
  if echo "$desc_lower" | grep -qE "^(fix|bug|patch|resolve|correct)"; then
    prefix="fix"
  elif echo "$desc_lower" | grep -qE "(test|spec|unit test|e2e|integration test)"; then
    prefix="test"
  elif echo "$desc_lower" | grep -qE "^(refactor|restructure|reorganize|simplify|clean)"; then
    prefix="refactor"
  elif echo "$desc_lower" | grep -qE "^(doc|document|readme|update doc)"; then
    prefix="docs"
  elif echo "$desc_lower" | grep -qE "^(chore|update dep|upgrade|bump|config)"; then
    prefix="chore"
  elif echo "$desc_lower" | grep -qE "^(style|format|lint|css|styling)"; then
    prefix="style"
  elif echo "$desc_lower" | grep -qE "^(perf|performance|optimize|speed)"; then
    prefix="perf"
  elif echo "$desc_lower" | grep -qE "^(build|ci|deploy|pipeline)"; then
    prefix="build"
  fi

  # Remove common prefix words and convert to slug
  local slug=$(echo "$desc_lower" \
    | sed -E 's/^(add|create|implement|fix|bug|patch|resolve|correct|test|write|refactor|restructure|update|doc|document|chore|style|perf|build|ci)[[:space:]]*//' \
    | sed -E 's/[^a-z0-9]+/-/g' \
    | sed -E 's/^-+|-+$//g' \
    | cut -c1-40)

  echo "${prefix}/${slug}"
}

BRANCH=$(generate_branch_name "$DESCRIPTION")
MAIN_REPO=$(pwd)
WORKTREE_NAME="webapp-$(echo "$BRANCH" | tr '/' '-')"
WORKTREE_PATH="../$WORKTREE_NAME"
WORKTREE_ABSOLUTE="$(cd "$(dirname "$WORKTREE_PATH")" 2>/dev/null && pwd)/$WORKTREE_NAME"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Worktree Development Workflow${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Branch:      ${GREEN}$BRANCH${NC}"
echo -e "Base:        ${GREEN}$BASE_BRANCH${NC}"
echo -e "Description: ${GREEN}$DESCRIPTION${NC}"
echo -e "Worktree:    ${GREEN}$WORKTREE_PATH${NC}"
echo ""

# Check if branch already exists
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  # Branch exists - check if it has an active worktree
  if git worktree list | grep -q "$BRANCH"; then
    echo -e "${RED}Error: Branch '$BRANCH' has an active worktree${NC}"
    echo "Use a different description or finish the existing worktree session"
    exit 1
  fi

  # Orphaned branch - check if it has commits beyond base
  COMMITS_AHEAD=$(git rev-list --count "$BASE_BRANCH".."$BRANCH" 2>/dev/null || echo "0")

  if [ "$COMMITS_AHEAD" = "0" ]; then
    # No commits - auto-delete orphaned branch
    echo -e "${YELLOW}Cleaning up orphaned branch (no commits): $BRANCH${NC}"
    git branch -D "$BRANCH"
    CREATE_BRANCH="-b $BRANCH"
  else
    echo -e "${YELLOW}Warning: Branch '$BRANCH' exists with $COMMITS_AHEAD commit(s)${NC}"
    read -p "Delete branch and start fresh? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      git branch -D "$BRANCH"
      CREATE_BRANCH="-b $BRANCH"
    else
      echo -e "${YELLOW}Continuing with existing branch${NC}"
      CREATE_BRANCH=""
    fi
  fi
else
  CREATE_BRANCH="-b $BRANCH"
fi

# Check if worktree path already exists
if [ -d "$WORKTREE_PATH" ]; then
  echo -e "${RED}Error: Worktree path already exists: $WORKTREE_PATH${NC}"
  echo "Remove it first: git worktree remove $WORKTREE_PATH"
  exit 1
fi

# Step 1: Create worktree
echo -e "${BLUE}[1/6] Creating worktree...${NC}"
if [ -n "$CREATE_BRANCH" ]; then
  git worktree add "$WORKTREE_PATH" $CREATE_BRANCH "$BASE_BRANCH"
else
  git worktree add "$WORKTREE_PATH" "$BRANCH"
fi
echo -e "${GREEN}✓ Worktree created${NC}"

# Step 2: Copy Claude config to worktree
echo -e "${BLUE}[2/6] Copying Claude config to worktree...${NC}"

# Copy .claude directory (overwrites any existing from git checkout)
if [ -d ".claude" ]; then
  cp -r .claude "$WORKTREE_PATH/"
  if [ -d "$WORKTREE_PATH/.claude" ]; then
    echo -e "${GREEN}✓ .claude directory copied${NC}"
  else
    echo -e "${RED}Error: Failed to copy .claude directory${NC}"
    exit 1
  fi
else
  echo -e "${RED}Error: No .claude directory found in $MAIN_REPO${NC}"
  exit 1
fi

# Copy CLAUDE.md
if [ -f "CLAUDE.md" ]; then
  cp CLAUDE.md "$WORKTREE_PATH/"
  if [ -f "$WORKTREE_PATH/CLAUDE.md" ]; then
    echo -e "${GREEN}✓ CLAUDE.md copied${NC}"
  else
    echo -e "${RED}Error: Failed to copy CLAUDE.md${NC}"
    exit 1
  fi
else
  echo -e "${RED}Error: No CLAUDE.md found in $MAIN_REPO${NC}"
  exit 1
fi

# Step 3: Write session file
echo -e "${BLUE}[3/6] Writing session file...${NC}"
cat > "$WORKTREE_PATH/.worktree-session.json" << EOF
{
  "branch": "$BRANCH",
  "baseBranch": "$BASE_BRANCH",
  "description": "$DESCRIPTION",
  "mainRepo": "$MAIN_REPO",
  "createdAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
echo -e "${GREEN}✓ Session file created${NC}"

# Step 4: Launch Claude in worktree
echo ""
echo -e "${BLUE}[4/6] Launching Claude in worktree...${NC}"

cd "$WORKTREE_PATH"

# Final verification - ensure Claude config exists before launch
if [ ! -f "CLAUDE.md" ] || [ ! -d ".claude" ]; then
  echo -e "${RED}Error: Claude config missing in worktree${NC}"
  echo "  CLAUDE.md exists: $([ -f CLAUDE.md ] && echo 'yes' || echo 'no')"
  echo "  .claude exists: $([ -d .claude ] && echo 'yes' || echo 'no')"
  exit 1
fi

echo -e "${YELLOW}When done, run /worktree:finish then exit Claude.${NC}"
echo ""
echo -e "${BLUE}----------------------------------------${NC}"

# Launch Claude with prompt to start brainstorm
# --dangerously-skip-permissions for seamless flow
claude --dangerously-skip-permissions "/brainstorm $DESCRIPTION

When implementation is complete, run /worktree:finish then exit Claude to complete cleanup." || true

# Step 5: Cleanup
echo ""
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${BLUE}[5/6] Cleaning up...${NC}"
cd "$MAIN_REPO"

# Prune stale worktree entries first
git worktree prune

# Check if worktree still exists before removing
if git worktree list | grep -q "$WORKTREE_NAME"; then
  git worktree remove "$WORKTREE_PATH" --force 2>/dev/null || {
    echo -e "${YELLOW}Warning: Could not remove worktree automatically${NC}"
    echo "You may need to run: git worktree remove $WORKTREE_PATH --force"
  }
  echo -e "${GREEN}✓ Worktree removed${NC}"
else
  echo -e "${YELLOW}Worktree already removed${NC}"
fi

# Smart branch cleanup - only delete if no commits were made
COMMITS_AHEAD=$(git rev-list --count "$BASE_BRANCH".."$BRANCH" 2>/dev/null || echo "0")

if [ "$COMMITS_AHEAD" = "0" ]; then
  git branch -D "$BRANCH" 2>/dev/null && \
    echo -e "${GREEN}✓ Branch deleted (no commits made)${NC}" || true
else
  echo -e "${GREEN}✓ Branch kept: $BRANCH ($COMMITS_AHEAD commit(s) ready to merge)${NC}"
fi

# Step 6: Report
echo -e "${BLUE}[6/6] Session report${NC}"

CHANGED_FILES=$(git diff --name-only "$BASE_BRANCH".."$BRANCH" 2>/dev/null || echo "No changes")
COMMIT_COUNT=$(git rev-list --count "$BASE_BRANCH".."$BRANCH" 2>/dev/null || echo "0")

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Worktree session complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Summary${NC}"
echo -e "  Feature: ${GREEN}$DESCRIPTION${NC}"
echo -e "  Branch:  ${GREEN}$BRANCH${NC}"
echo -e "  Base:    ${GREEN}$BASE_BRANCH${NC}"
echo -e "  Commits: ${GREEN}$COMMIT_COUNT${NC}"
echo ""

if [ "$COMMIT_COUNT" != "0" ]; then
  echo -e "${BLUE}Changed Files${NC}"
  echo "$CHANGED_FILES" | sed 's/^/  /'
  echo ""
  echo -e "${BLUE}Next Steps${NC}"
  echo -e "  To merge:              ${YELLOW}git checkout $BASE_BRANCH && git merge $BRANCH${NC}"
  echo -e "  To delete after merge: ${YELLOW}git branch -d $BRANCH${NC}"
else
  echo -e "${YELLOW}No commits were made. Branch was cleaned up.${NC}"
fi
echo ""
