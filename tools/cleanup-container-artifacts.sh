#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

rm -rf dist .nx dogfood-output

if docker info >/dev/null 2>&1; then
  docker builder prune -af >/dev/null || true
  docker image prune -af >/dev/null || true
fi

df -h .
