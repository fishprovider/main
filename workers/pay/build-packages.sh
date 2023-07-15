#!/bin/bash

cd ../..
npm run build -w packages/utils
npm run build -w packages/core
npm run build -w packages/coin
