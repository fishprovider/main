#!/bin/bash

REMOTE=vercel

git config --global push.default current
git config --global checkout.defaultRemote $REMOTE

git checkout dev; git pull $REMOTE dev; git merge master --no-verify
git checkout canary; git pull $REMOTE canary; git merge dev --no-verify
git checkout release; git pull $REMOTE release; git merge canary --no-verify

git checkout release; git push $REMOTE release
git checkout canary; git push $REMOTE canary
git checkout dev; git push $REMOTE dev
git checkout master; git push $REMOTE master
