#!/bin/bash

cd ../../scripts

function old() {
  bash ./build-backend-full.sh build-share
}

old &
bash ./build-backend-clean-arc.sh build-share &
wait
