#!/bin/bash

APP=$1
APP_TYPE=$2 # backend or frontend
DEPLOY_ENV=fishSecondary

APP_DIR=apps-$APP_TYPE/$APP
APP_NAME=$APP-secondary

DOPPLER_TOKEN=$(doppler configure get token --plain) pm2 deploy pm2.config.cjs $DEPLOY_ENV \
exec "source ./pm2-preload.sh; npm run pm2-stop $APP_NAME; npm run build -w $APP_DIR; npm run pm2-start $APP_NAME"
