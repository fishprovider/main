#!/bin/bash

APP=$1
APP_TYPE=${2:-backend}
DEPLOY_ENV=${3:-fish}

DOPPLER_TOKEN=$(doppler configure get token --plain) pm2 deploy pm2.config.cjs $DEPLOY_ENV \
exec "source ~/.zshrc; npm run pm2-stop $APP; npm run build -w apps-$APP_TYPE/$APP; npm run pm2-start $APP"
