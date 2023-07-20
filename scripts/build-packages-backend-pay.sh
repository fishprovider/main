#!/bin/bash

cd ..

npm run build -w packages/core

npm run build -w packages/ctrader &
npm run build -w packages/metatrader &
# npm run build -w packages/binance &
wait

npm run build -w packages/coin
