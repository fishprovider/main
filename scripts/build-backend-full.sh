#!/bin/bash

MODE=$1

if [ "$MODE" == "build-share" ]; then
  sh ./build-share.sh
fi

sh ./build-backend-share.sh

sh ./build-backend-trade.sh &
sh ./build-backend-pay.sh &
wait
