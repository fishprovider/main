#!/bin/bash

git checkout dev; git merge master --no-verify

git checkout dev; git push origin dev
git checkout master; git push origin master
