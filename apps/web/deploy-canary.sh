#!/bin/bash

git checkout canary; git merge master --no-verify

git checkout canary; git push origin canary
git checkout master; git push origin master
