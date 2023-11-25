#!/bin/bash

ls -1 ../../packages | while read PROJECT; do
  npm run postbuild -w ../../packages/$PROJECT
done

grep node_modules -rq --include=\*.js dist || exit 0 && echo 'node_modules found in dist' && exit 1
