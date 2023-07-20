#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share.sh
fi

bash ./build-frontend-share.sh
