#!/bin/bash

cd ../../scripts

function old() {
  sh ./build-share.sh
  sh ./build-backend-full.sh
}

old &
sh ./build-backend-clean-arc.sh &
wait
