#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share-new.sh
fi

cd ..

function notif() {
  npm run build -w packages-backend/slack &
  npm run build -w packages-backend/discord &
  npm run build -w packages-backend/expo &
  wait
  npm run build -w packages-backend/notif
}

function dataAccess() {
  npm run build -w packages-backend/firebase &
  npm run build -w packages-backend/mongo &
  npm run build -w packages-backend/redis &
  wait
  npm run build -w packages-backend/data-access
}

function trade() {
  npm run build -w packages-backend/ctrader-api &
  npm run build -w packages-backend/metatrader-api &
  npm run build -w packages-backend/meta-api &
  wait
  npm run build -w packages-backend/trade
}

npm run build -w packages-backend/queue &
notif &
dataAccess &
trade &
wait
