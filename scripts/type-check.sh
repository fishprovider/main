#!/bin/bash

cd ..

DIRS='packages
packages-share
packages-backend
packages-frontend
apps-backend
apps-frontend'

for DIR in $DIRS; do
  ls -1 $DIR | while read PROJECT; do
    npm run type-check -w $DIR/$PROJECT
  done
done
