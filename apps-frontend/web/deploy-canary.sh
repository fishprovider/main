#!/bin/bash

. ./git-config.sh

git checkout dev; git pull origin dev; git merge master --no-verify
git checkout canary; git pull origin canary; git merge dev --no-verify

git checkout canary; git push origin canary
git checkout dev; git push origin dev
git checkout master; git push origin master
