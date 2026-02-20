#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPECTED_REACT="19.2.4"
EXPECTED_REACT_DOM="19.2.4"

OUTPUT="$(pnpm -C "$ROOT_DIR/apps/astro" why react react-dom)"

echo "$OUTPUT" | grep -q "react@${EXPECTED_REACT}" || {
  echo "Expected react@${EXPECTED_REACT} in apps/astro"
  exit 1
}

echo "$OUTPUT" | grep -q "react-dom@${EXPECTED_REACT_DOM}" || {
  echo "Expected react-dom@${EXPECTED_REACT_DOM} in apps/astro"
  exit 1
}

echo "$OUTPUT" | grep -q "Found 1 version of react$" || {
  echo "apps/astro resolves multiple react versions"
  exit 1
}

echo "$OUTPUT" | grep -q "Found 1 version of react-dom$" || {
  echo "apps/astro resolves multiple react-dom versions"
  exit 1
}

echo "React resolution check passed for apps/astro"
