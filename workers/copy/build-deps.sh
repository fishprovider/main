#!/bin/bash
[ $SKIP_BUILD_DEPS = true ] && exit 0

cd ../../scripts

bash ./build-backend-trade.sh build-backend-share
