#!/bin/bash

REMOTE=vercel

git config --global push.default current
git config --global checkout.defaultRemote $REMOTE

git checkout canary; git pull $REMOTE canary; git merge master --no-verify

git checkout canary; git push $REMOTE canary
git checkout master; git push $REMOTE master
