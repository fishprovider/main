#!/bin/bash

APP=$1
APP_TYPE=$2 # backend or frontend
DEPLOY_ENV=$3

APP_DIR=apps-$APP_TYPE/$APP

DOPPLER_TOKEN=$(doppler configure get token --plain) pm2 deploy pm2.config.cjs $DEPLOY_ENV \
exec "source ./pm2-preload.sh; npm run pm2-stop $APP; npm run build -w $APP_DIR; npm run pm2-start $APP"
