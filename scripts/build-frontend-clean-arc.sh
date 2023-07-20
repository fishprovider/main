#!/bin/bash

bash ./build-clean-arc-share.sh

cd ..

function adapters() {
  npm run build -w adapters/frontend
}

function frameworks() {
  npm run build -w frameworks/fish-api &
  npm run build -w frameworks/local &
  wait

  npm run build -w frameworks/offline-first
}

adapters &
frameworks &
wait
