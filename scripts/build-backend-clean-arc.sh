#!/bin/bash

bash ./build-clean-arc-share.sh

cd ..

function adapters() {
  npm run build -w adapters/backend
  wait
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
