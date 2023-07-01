#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "dev" || "$VERCEL_GIT_COMMIT_REF" == "canary" || "$VERCEL_GIT_COMMIT_REF" == "release" ]]; then
  echo "✅ - Build needed"
else
  echo "🛑 - Build skipped"
  exit 0
fi

git diff --quiet HEAD^ HEAD .
