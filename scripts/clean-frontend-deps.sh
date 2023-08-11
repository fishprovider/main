#!/bin/bash

APP=$1

cd ../packages && ls | grep -vE "utils|cross" | xargs rm -rf
cd ../workers && rm -rf *
cd ../apps && ls | grep -vE "$APP" | xargs rm -rf

cd ../adapters && ls | grep -vE "frontend" | xargs rm -rf
cd ../frameworks-backend && rm -rf *
