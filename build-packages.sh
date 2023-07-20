#!/bin/bash

cd scripts

sh ./build-packages-share.sh

sh ./build-packages-backend-full.sh &
sh ./build-packages-clean-arc.sh &
sh ./build-packages-frontend.sh &
wait
