#!/bin/bash

APP=$1
APP_TYPE=${2:-backend}
DEPLOY_ENV=fishSecondary

DOPPLER_TOKEN=$(doppler configure get token --plain) pm2 deploy pm2.config.cjs $DEPLOY_ENV \
exec "source ./pm2-preload.sh; npm run pm2-stop $APP-secondary; npm run build -w apps-$APP_TYPE/$APP; npm run pm2-start $APP-secondary"
