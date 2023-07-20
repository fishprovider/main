#!/bin/bash

sh ./build-clean-arc-share.sh

cd ..

function adapters() {
  echo todo
}

function frameworks() {
  echo todo
}

adapters &
frameworks &
wait
