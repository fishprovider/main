#!/bin/bash

APP=$1
APP_TYPE=${2:-backend}
DEPLOY_ENV=${3:-fish}

DEPLOY_ENV=$DEPLOY_ENV npm run pm2-deploy-stop $APP
DEPLOY_ENV=$DEPLOY_ENV npm run pm2-deploy-build apps-$APP_TYPE/$APP
DEPLOY_ENV=$DEPLOY_ENV npm run pm2-deploy-start $APP
