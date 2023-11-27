#!/bin/bash

rm -rf ~/work/fish/builds/*

export CI=false

EAS_LOCAL_BUILD_SKIP_CLEANUP=1 \
EAS_LOCAL_BUILD_WORKINGDIR=~/work/fish/builds \
EAS_LOCAL_BUILD_ARTIFACTS_DIR=~/work/fish/artifacts \
BUILD_PROFILE=production \
npm run build-local-android
