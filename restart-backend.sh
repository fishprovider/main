#!/bin/bash

DEPLOY_ENV=$1
APP_BACKEND=$2

DEPLOY_ENV=$DEPLOY_ENV npm run pm2-deploy-build apps-backend/$APP_BACKEND
DEPLOY_ENV=$DEPLOY_ENV npm run pm2-deploy-start $APP_BACKEND
