#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share-new.sh
fi

cd ..

function frameworks() {
  npm run build -w repositories-frontend/local &
  npm run build -w repositories-frontend/store &
  wait

  npm run build -w repositories-frontend/fish-api
  npm run build -w repositories-frontend/offline-first
}

frameworks &
wait
