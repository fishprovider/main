#!/bin/bash

APP=$1
APP_TYPE=$2 # backend or frontend
DEPLOY_ENV=$3

APP_DIR=apps-$APP_TYPE/$APP

# pull
pm2 deploy pm2.config.cjs $DEPLOY_ENV

# npm
pm2 deploy pm2.config.cjs $DEPLOY_ENV \
exec "source ./pm2-preload.sh; npm i -w $APP_DIR"

# stop, build, and start
./restart $APP $APP_TYPE $DEPLOY_ENV
