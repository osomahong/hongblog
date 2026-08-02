#!/usr/bin/env bash
#
# Refresh the distributable copy of a skill from the working copy, then refuse
# to leave anything credential-shaped behind.
#
#   ./dist/skills/sync.sh                    sync every skill listed below
#   ./dist/skills/sync.sh seo-topic-finder   sync one
#   ./dist/skills/sync.sh --check            scan the current dist copy, sync nothing
#
# Run from anywhere. Paths resolve against the repository root.
#
# The scan is the point of this script. The working copy reads credentials from
# ~/.seo-title-advisor.env and never stores them, but "never" is a property of
# today's code, not of every future edit. This gate runs on the files that are
# about to be committed.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC_ROOT="$REPO_ROOT/.claude/skills"
DIST_ROOT="$REPO_ROOT/dist/skills"

# Skills that ship. Add a name here to include it.
SKILLS=(seo-topic-finder)

CHECK_ONLY=0
if [ "${1:-}" = "--check" ]; then
  CHECK_ONLY=1
  shift
fi
if [ $# -gt 0 ]; then
  SKILLS=("$@")
fi

sync_skill() {
  local name="$1"
  local src="$SRC_ROOT/$name"
  local dest="$DIST_ROOT/$name"

  if [ ! -d "$src" ]; then
    echo "  ! working copy not found: $src" >&2
    return 1
  fi

  rm -rf "$dest"
  mkdir -p "$dest"
  # Anything credential-bearing is excluded by name before the scan ever runs.
  rsync -a \
    --exclude '.env' \
    --exclude '.env.*' \
    --exclude '*.key' \
    --exclude '*.pem' \
    --exclude 'node_modules' \
    --exclude '.DS_Store' \
    "$src/" "$dest/"
  echo "  synced $name"
}

# Two passes over the skill directories. sync.sh itself is not scanned: it holds
# these patterns as literals and would always match itself.
#
# Hard patterns are never filtered. A real key has no legitimate reason to appear
# in documentation, so any hit is a failure.
#
# Assignment lines are filtered against placeholder markers, because setup guides
# and env.example legitimately show KEY=<something illustrative>. The filter is
# deliberately narrow: an unrecognised value on an assignment line fails.
scan() {
  local target="$1"
  local hard soft hits

  hard=$(grep -REn \
    -e '-----BEGIN [A-Z ]*PRIVATE KEY-----' \
    -e '"private_key"[[:space:]]*:' \
    -e '[A-Za-z0-9._%+-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com' \
    -e 'AIza[0-9A-Za-z_-]{35}' \
    "$target" 2>/dev/null || true)

  soft=$(grep -REn \
    -e '^[[:space:]]*(GSC_SERVICE_ACCOUNT_KEY|GSC_SITE_URL|GA4_SERVICE_ACCOUNT_KEY|NAVER_AD_[A-Z_]+|SERPAPI_KEY)=.+' \
    "$target" 2>/dev/null \
    | grep -Ev 'example\.com|your_|/Users/me/|\.\.\.|<|1234567$|0100000000|AQAAAAA' \
    || true)

  hits=$(printf '%s\n%s' "$hard" "$soft" | grep -v '^$' || true)

  if [ -n "$hits" ]; then
    echo "" >&2
    echo "BLOCKED: credential-shaped content in the distributable copy." >&2
    echo "$hits" >&2
    echo "" >&2
    echo "Remove it from the working copy, then run this script again." >&2
    return 1
  fi
  return 0
}

echo "repo: $REPO_ROOT"

if [ "$CHECK_ONLY" -eq 0 ]; then
  echo "sync:"
  for name in "${SKILLS[@]}"; do
    sync_skill "$name"
  done
fi

echo "scan:"
for name in "${SKILLS[@]}"; do
  scan "$DIST_ROOT/$name"
  echo "  clean $name"
done

echo ""
echo "Done. Review with: git status dist/skills"
