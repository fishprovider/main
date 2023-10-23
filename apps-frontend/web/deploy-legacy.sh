#!/bin/bash

git config --global push.default current
git config --global checkout.defaultRemote origin

git checkout dev; git pull origin dev; git merge master --no-verify
git checkout canary; git pull origin canary; git merge dev --no-verify
git checkout release; git pull origin release; git merge canary --no-verify

git checkout release; git push origin release
git checkout canary; git push origin canary
git checkout dev; git push origin dev
git checkout master; git push origin master
