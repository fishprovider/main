#!/bin/bash

APP=$1

cd ../adapters && ls | grep -vE "frontend" | xargs rm -rf
cd ../apps && ls | grep -vE "$APP" | xargs rm -rf
cd ../frameworks && ls | grep -vE "local|store|fish-api|offline-first" | xargs rm -rf
cd ../packages && ls | grep -vE "utils|cross|enterprise-rules|application-rules" | xargs rm -rf
cd ../workers && rm -rf *
