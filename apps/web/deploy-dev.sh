#!/bin/bash

. ./git-config.sh

git checkout dev; git pull origin dev; git pull origin master --no-verify

git checkout dev; git push origin dev

git checkout master
