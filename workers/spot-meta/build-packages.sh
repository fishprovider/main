#!/bin/bash

cd ../..
npm run build -w packages/utils

function build_swap {
  npm run build -w packages/ctrader &
  npm run build -w packages/metatrader &
  # npm run build -w packages/binance &
  wait
  npm run build -w packages/swap
}

npm run build -w packages/core &
build_swap &
wait
