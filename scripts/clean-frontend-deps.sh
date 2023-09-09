#!/bin/bash

APP=$1

cd ../packages && ls | grep -vE "utils|cross|core-new" | xargs rm -rf
cd ../packages-backend && rm -rf *
cd ../workers && rm -rf *
cd ../apps && ls | grep -vE "$APP" | xargs rm -rf
