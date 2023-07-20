#!/bin/bash

cd ..

npm run build -w packages/ctrader &
npm run build -w packages/metatrader &
# npm run build -w packages/binance &
wait

npm run build -w packages/swap
