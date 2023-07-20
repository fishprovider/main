#!/bin/bash

cd ../../scripts

function old() {
  sh ./build-frontend-full.sh build-share
}

old &
# sh ./build-frontend-clean-arc.sh &
wait
