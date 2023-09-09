#!/bin/bash
[ $SKIP_BUILD_DEPS = true ] && exit 0

cd ../../scripts

function old() {
  bash ./build-backend-full.sh build-share
}

old &
bash ./build-backend-new.sh build-share &
wait
