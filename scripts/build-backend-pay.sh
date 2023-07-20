#!/bin/bash

MODE=$1

if [ "$MODE" == "build-share" ]; then
  sh ./build-share.sh
elif [ "$MODE" == "build-backend-share" ]; then
  sh ./build-share.sh
  sh ./build-backend-share.sh
fi

cd ..

npm run build -w packages/coin
