#!/bin/bash

if [ "$MODE" = "build-share" ]; then
  bash ./build-clean-arc-share.sh
fi

cd ..

function adapters() {
  npm run build -w adapters/frontend
}

function frameworks() {
  npm run build -w frameworks/fish-api &
  npm run build -w frameworks/local &
  npm run build -w frameworks/store &
  wait

  npm run build -w frameworks/offline-first
}

adapters &
frameworks &
wait
