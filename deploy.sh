#!/bin/bash

APP=$1

APP_TYPE=backend
APP_DIR=apps-$APP_TYPE/$APP

if [[ $APP == "web" ]]; then
  DEPLOY_ENV=fishWeb
  APP_TYPE=frontend
  APP_DIR=apps-$APP_TYPE/$APP
fi

if [[ $APP == "back" ]]; then
  DEPLOY_ENV=fishBack
fi

if [[ $APP == "bot" ]] || [[ $APP == "copy" ]]; then
  DEPLOY_ENV=fishBot
fi

if [[ $APP == "pay" ]]; then
  DEPLOY_ENV=fishPay
fi

if [[ $APP == "cron" ]] || [[ $APP == "mon" ]] || [[ $APP == "gate" ]]; then
  DEPLOY_ENV=fishCron
fi

if [[ $APP =~ ^head-* ]]; then
  DEPLOY_ENV=fishOrder
fi

if [[ $APP =~ ^spot-* ]]; then
  DEPLOY_ENV=fishPrice
  if [[ $APP =~ ^spot-*-poll ]]; then
    APP_DIR=apps-$APP_TYPE/${APP:0:-5}
  fi
fi

if [[ $APP == "web-secondary" ]]; then
  DEPLOY_ENV=fishSecondary
  APP_TYPE=frontend
  APP_DIR=apps-$APP_TYPE/web
fi

if [[ $APP == "back-secondary" ]]; then
  DEPLOY_ENV=fishSecondary
  APP_DIR=apps-$APP_TYPE/back
fi

# pull
pm2 deploy pm2.config.cjs $DEPLOY_ENV

# npm i
pm2 deploy pm2.config.cjs $DEPLOY_ENV \
exec "source ./pm2-preload.sh; npm run ci -- -w $APP_DIR"

# stop, build, and start
DOPPLER_TOKEN=$(doppler configure get token --plain) pm2 deploy pm2.config.cjs $DEPLOY_ENV \
exec "source ./pm2-preload.sh; pm2 stop pm2.config.cjs --only $APP; npm run build -w $APP_DIR; pm2 startOrReload pm2.config.cjs --only $APP"
