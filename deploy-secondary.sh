#!/bin/bash

APP=$1
APP_TYPE=$2 # backend or frontend
DEPLOY_ENV=fishSecondary

APP_DIR=apps-$APP_TYPE/$APP
APP_SECONDARY=$APP-secondary

# push tag (force)
git tag secondary -f
git push origin secondary -f

# pull tag
pm2 deploy pm2.config.cjs $DEPLOY_ENV

# npm
pm2 deploy pm2.config.cjs $DEPLOY_ENV \
exec "source ./pm2-preload.sh; npm i -w $APP_DIR"

# stop, build, and start
source ./restart.sh $APP_SECONDARY $APP_TYPE $DEPLOY_ENV
