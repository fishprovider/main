#!/bin/bash

command -v rbenv > /dev/null && eval "$(rbenv init - zsh)"

EAS_LOCAL_BUILD_SKIP_CLEANUP=1 \
EAS_LOCAL_BUILD_WORKINGDIR=~/work/fish/builds \
EAS_LOCAL_BUILD_ARTIFACTS_DIR=~/work/fish/artifacts \
npx eas build --non-interactive --no-wait --profile development --local -p ios
