#!/bin/bash

MODE=$1


if [ "$MODE" = "build-share" ]; then
  bash ./build-share.sh
elif [ "$MODE" = "build-backend-share" ]; then
  bash ./build-share.sh
  bash ./build-backend-share.sh
fi

cd ..

npm run build -w packages/ctrader
npm run build -w packages/metatrader
# npm run build -w packages/binance

npm run build -w packages/swap
