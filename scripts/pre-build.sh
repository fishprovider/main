#!/bin/bash

ls -1 ../../packages | while read PROJECT; do
  npm run postbuild -w ../../packages/$PROJECT
done
