#!/bin/bash

. ./git-config.sh

git checkout dev; git pull origin dev; git pull origin master --no-verify
git checkout canary; git pull origin canary; git pull origin dev --no-verify

git checkout canary; git push origin canary
git checkout dev; git push origin dev

git checkout master
