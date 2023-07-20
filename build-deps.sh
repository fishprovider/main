#!/bin/bash

cd scripts

sh ./build-share.sh

sh ./build-backend-full.sh &
sh ./build-backend-clean-arc.sh &
sh ./build-frontend.sh &
wait
