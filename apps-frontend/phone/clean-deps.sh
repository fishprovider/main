#!/bin/bash
[ $SKIP_BUILD_DEPS = true ] && exit 0

cd ../../scripts

bash ./clean-frontend-deps.sh phone
node ./clean-root-dev-deps.cjs
