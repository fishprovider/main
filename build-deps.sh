#!/bin/bash

cd scripts

function old() {
  bash ./build-share.sh

  bash ./build-backend-full.sh &
  bash ./build-frontend-full.sh &
  wait
}

function new() {
  bash ./build-clean-arc-share.sh

  bash ./build-backend-clean-arc.sh &
  bash ./build-frontend-clean-arc.sh &
  wait
}

old &
new &
wait
