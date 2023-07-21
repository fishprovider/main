#!/bin/bash

cd ../../scripts

function old() {
  bash ./build-frontend-full.sh build-share
}

old &
bash ./build-frontend-clean-arc.sh build-share &
wait
