#!/bin/bash

APP=$1

cd ../packages && ls | grep -vE "utils|cross" | xargs rm -rf

cd ../packages-backend && rm -rf *
cd ../apps-backend && rm -rf *

cd ../apps-frontend && ls | grep -vE "$APP" | xargs rm -rf
