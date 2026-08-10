#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
INDEX_HTML="$REPO_ROOT/index.html"

usage() {
  echo "Usage: $0 <version> [--deploy]"
  echo "  version   New version in X.Y.Z format (e.g. 0.17.0)"
  echo "  --deploy  After updating, build and deploy to Cloudflare Pages"
  exit 1
}

# Parse args
VERSION=""
DEPLOY=false
for arg in "$@"; do
  case "$arg" in
    --deploy) DEPLOY=true ;;
    --help|-h) usage ;;
    *)
      if [[ -z "$VERSION" ]]; then
        VERSION="$arg"
      else
        echo "Error: unexpected argument '$arg'" >&2
        usage
      fi
      ;;
  esac
done

if [[ -z "$VERSION" ]]; then
  echo "Error: version argument required" >&2
  usage
fi

# Validate semver-like format X.Y.Z
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: version must be in X.Y.Z format (e.g. 0.17.0), got: '$VERSION'" >&2
  exit 1
fi

if [[ ! -f "$INDEX_HTML" ]]; then
  echo "Error: index.html not found at $INDEX_HTML" >&2
  exit 1
fi

# Find the current version in the download URL pattern
PATTERN='releases/download/v[0-9]\+\.[0-9]\+\.[0-9]\+/clik_[0-9]\+\.[0-9]\+\.[0-9]\+_aarch64\.dmg'
CURRENT_LINE=$(grep -n "$PATTERN" "$INDEX_HTML" || true)

if [[ -z "$CURRENT_LINE" ]]; then
  echo "Error: could not find download URL pattern in index.html" >&2
  echo "Expected pattern: releases/download/v<VERSION>/clik_<VERSION>_aarch64.dmg" >&2
  exit 1
fi

# Extract current version from the match
CURRENT_VERSION=$(echo "$CURRENT_LINE" | grep -o 'download/v[0-9]\+\.[0-9]\+\.[0-9]\+' | head -1 | sed 's/download\/v//')

if [[ -z "$CURRENT_VERSION" ]]; then
  echo "Error: could not extract current version from download URL" >&2
  exit 1
fi

if [[ "$CURRENT_VERSION" == "$VERSION" ]]; then
  echo "Version is already $VERSION, nothing to change."
  exit 0
fi

echo "Current version: $CURRENT_VERSION"
echo "New version:     $VERSION"
echo ""
echo "Would replace in index.html:"
echo "  releases/download/v${CURRENT_VERSION}/clik_${CURRENT_VERSION}_aarch64.dmg"
echo "  -> releases/download/v${VERSION}/clik_${VERSION}_aarch64.dmg"
echo ""

# Perform the replacement
sed -i '' \
  "s|releases/download/v${CURRENT_VERSION}/clik_${CURRENT_VERSION}_aarch64\.dmg|releases/download/v${VERSION}/clik_${VERSION}_aarch64.dmg|g" \
  "$INDEX_HTML"

# The version is also printed as a badge in the nav and the footer, so sweep every
# remaining `vX.Y.Z` mention. Leaving those behind makes the page advertise a
# download link and a version number that disagree with each other.
sed -i '' "s|v${CURRENT_VERSION}|v${VERSION}|g" "$INDEX_HTML"

# Verify the change was made
VERIFY=$(grep -c "releases/download/v${VERSION}/clik_${VERSION}_aarch64.dmg" "$INDEX_HTML" || true)
STALE=$(grep -c "${CURRENT_VERSION}" "$INDEX_HTML" || true)
echo "Done. Updated $VERIFY download link(s) in index.html."
if [[ "$STALE" != "0" ]]; then
  echo "Error: $STALE mention(s) of $CURRENT_VERSION still remain in index.html" >&2
  grep -n "${CURRENT_VERSION}" "$INDEX_HTML" >&2
  exit 1
fi

if [[ "$DEPLOY" == true ]]; then
  echo ""
  echo "Running build and deploy..."
  cd "$REPO_ROOT"
  bun run build
  wrangler pages deploy dist --project-name=clik-releases
  echo "Deploy complete."
fi
