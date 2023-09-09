#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share-new.sh
fi

cd ..

npm run build -w packages-share/libs

npm run build -w packages-backend/redis &
npm run build -w packages-backend/mongo &
wait

npm run build -w packages-backend/cache-first
