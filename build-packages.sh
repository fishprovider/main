#!/bin/bash

function frontend() {
  npm run build -w packages/cross
}

function backend() {
  npm run build -w packages/core

  npm run build -w packages/ctrader &
  npm run build -w packages/metatrader &
  # npm run build -w packages/binance &
  wait

  npm run build -w packages/swap &
  npm run build -w packages/coin &
  wait
}

function old() {
  npm run build -w packages/utils

  frontend &
  backend &
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
  npm run build -w frameworks/cache-first &
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
