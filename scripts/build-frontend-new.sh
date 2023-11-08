#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share-new.sh
fi

cd ..

npm run build -w packages-frontend/core-frontend

npm run build -w packages-frontend/fish-api
npm run build -w packages-frontend/local
npm run build -w packages-frontend/local-first

npm run build -w packages-frontend/store
npm run build -w packages-frontend/store-first
