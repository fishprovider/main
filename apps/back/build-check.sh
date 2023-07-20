#!/bin/bash

grep node_modules -rq --include=\*.js dist || exit 0 && echo 'node_modules found in dist' && exit 1
