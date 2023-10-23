#!/bin/bash

REMOTE=vercel

git config --global push.default current
git config --global checkout.defaultRemote $REMOTE

git checkout dev; git pull $REMOTE dev; git merge master --no-verify
git checkout canary; git pull $REMOTE canary; git merge dev --no-verify
git checkout legacy; git pull $REMOTE legacy; git merge canary --no-verify

git checkout legacy; git push $REMOTE legacy
git checkout canary; git push $REMOTE canary
git checkout dev; git push $REMOTE dev
git checkout master; git push $REMOTE master
