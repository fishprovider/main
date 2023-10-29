#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share-new.sh
fi

cd ..

npm run build -w packages-backend/core-backend

npm run build -w packages-backend/queue

npm run build -w packages-backend/slack
npm run build -w packages-backend/discord
npm run build -w packages-backend/expo
npm run build -w packages-backend/firebase
npm run build -w packages-backend/notif

npm run build -w packages-backend/mongo
npm run build -w packages-backend/redis
npm run build -w packages-backend/data-access

npm run build -w packages-backend/ctrader-api
npm run build -w packages-backend/metatrader-api
npm run build -w packages-backend/meta-api
npm run build -w packages-backend/trade
