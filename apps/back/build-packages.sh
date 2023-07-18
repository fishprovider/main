#!/bin/bash

cd ../..

function old() {
  npm run build -w packages/utils

  npm run build -w packages/ctrader &
  npm run build -w packages/metatrader &
  # npm run build -w packages/binance &
  npm run build -w packages/core &
  wait

  npm run build -w packages/swap &
  npm run build -w packages/coin &
  wait
}

#
# Clean Architecture
#

function adapters() {
  npm run build -w adapters/backend &
  # npm run build -w adapters/frontend &
  wait
}

function frameworks() {
  npm run build -w frameworks/mongo &
  npm run build -w frameworks/redis &
  wait
}

function new() {
  npm run build -w packages/enterprise-rules
  npm run build -w packages/application-rules

  adapters &
  frameworks &
  wait
}

old &
new &
wait
