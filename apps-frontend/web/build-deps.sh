#!/bin/bash
[ $SKIP_BUILD_DEPS = true ] && exit 0

cd ../../scripts

function old() {
  bash ./build-frontend-full.sh build-share
}

old &
bash ./build-frontend-new.sh build-share &
wait
