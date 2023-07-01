#!/bin/bash

git checkout canary; git merge master --no-verify
git checkout release; git merge canary --no-verify

git checkout release; git push origin release
git checkout canary; git push origin canary
git checkout master; git push origin master
