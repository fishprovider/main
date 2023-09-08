#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share-new.sh
fi

cd ..

npm run build -w packages-new/libs

npm run build -w repositories-backend/redis &
npm run build -w repositories-backend/mongo &
wait

npm run build -w repositories-backend/cache-first
