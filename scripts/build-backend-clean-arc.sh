#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-clean-arc-share.sh
fi

cd ..

npm run build -w repositories-backend/redis &
npm run build -w repositories-backend/mongo &
wait

npm run build -w repositories-backend/cache-first
