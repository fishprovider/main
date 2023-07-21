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
  npm run build -w frameworks/mongo &
  npm run build -w frameworks/redis &
  wait

  npm run build -w frameworks/cache-first
}

adapters &
frameworks &
wait
