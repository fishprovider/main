#!/bin/bash

cd scripts

bash ./build-share.sh

bash ./build-backend-clean-arc.sh &
bash ./build-backend-full.sh &
bash ./build-frontend-full.sh &
wait
