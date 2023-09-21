#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share-new.sh
fi

cd ..


npm run build -w packages-backend/fish-api &
npm run build -w packages-backend/local &
npm run build -w packages-backend/store &
wait

npm run build -w packages-frontend/data-fetch
