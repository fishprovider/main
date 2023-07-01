#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "dev" || "$VERCEL_GIT_COMMIT_REF" == "canary" || "$VERCEL_GIT_COMMIT_REF" == "release" ]]; then
  echo "✅ - Build started"
  exit 1
else
  echo "🛑 - Build ignored"
  exit 0
fi
