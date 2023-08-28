#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-clean-arc-share.sh
fi

cd ..

function adapters() {
  npm run build -w adapters/backend
}

function frameworks() {
  npm run build -w frameworks-backend/redis &
  npm run build -w frameworks-backend/mongo &

  # npm run build -w repositories-backend/redis &
  npm run build -w repositories-backend/mongo &
  wait

  npm run build -w frameworks-backend/cache-first
}

adapters &
frameworks &
wait
