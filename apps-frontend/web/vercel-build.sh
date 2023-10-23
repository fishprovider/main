#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "canary" || "$VERCEL_GIT_COMMIT_REF" == "legacy" ]]; then
  echo "✅ - Build needed"
  exit 1
else
  echo "🛑 - Build skipped"
  exit 0
fi
