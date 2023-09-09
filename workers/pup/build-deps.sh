#!/bin/bash
[ $SKIP_BUILD_DEPS = true ] && exit 0

cd ../../scripts

bash ./build-share.sh
bash ./build-backend-share.sh
