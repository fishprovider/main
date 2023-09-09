#!/bin/bash
[ $SKIP_BUILD_DEPS = true ] && exit 0

cd ../../scripts

bash ./build-backend-pay.sh build-backend-share
