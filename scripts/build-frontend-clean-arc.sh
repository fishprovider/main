#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-clean-arc-share.sh
fi

cd ..

function adapters() {
  npm run build -w adapters/frontend
}

function frameworks() {
  npm run build -w frameworks-frontend/local &
  npm run build -w frameworks-frontend/store &
  wait

  npm run build -w frameworks-frontend/fish-api
  npm run build -w frameworks-frontend/offline-first
}

adapters &
frameworks &
wait
