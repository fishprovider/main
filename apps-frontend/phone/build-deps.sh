#!/bin/bash

cd ../../scripts

function old() {
  bash ./build-frontend-full.sh build-share
}

old &
# bash ./build-frontend-new.sh build-share &
wait
