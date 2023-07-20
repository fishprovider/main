#!/bin/bash

MODE=$1


if [ "$MODE" == "build-share" ]; then
  sh ./build-share.sh
elif [ "$MODE" == "build-backend-share" ]; then
  sh ./build-share.sh
  sh ./build-backend-share.sh
fi

cd ..

npm run build -w packages/ctrader &
npm run build -w packages/metatrader &
# npm run build -w packages/binance &
wait

npm run build -w packages/swap
