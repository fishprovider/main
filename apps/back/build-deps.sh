#!/bin/bash

cd ../../scripts

function old() {
  sh ./build-backend-full.sh build-share
}

old &
sh ./build-backend-clean-arc.sh &
wait
