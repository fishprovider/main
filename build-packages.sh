#!/bin/bash

npm run build -w packages/utils &
npm run build -w packages/cross &
wait

npm run build -w packages/ctrader &
npm run build -w packages/metatrader &
# npm run build -w packages/binance &
npm run build -w packages/core &
wait

npm run build -w packages/swap &
npm run build -w packages/coin &
wait
