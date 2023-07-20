#!/bin/bash

MODE=$1

if [ "$MODE" == "build-share" ]; then
  sh ./build-share.sh
fi

sh ./build-frontend-share.sh
