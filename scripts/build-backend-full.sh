#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share.sh
fi

bash ./build-backend-share.sh

bash ./build-backend-trade.sh &
bash ./build-backend-pay.sh &
wait
