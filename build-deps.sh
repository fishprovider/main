#!/bin/bash

cd scripts

function old() {
  bash ./build-share.sh

  bash ./build-backend-full.sh &
  bash ./build-frontend-full.sh &
  wait
}

function new() {
  bash ./build-share-new.sh

  bash ./build-backend-new.sh &
  bash ./build-frontend-new.sh &
  wait
}

old &
new &
wait
