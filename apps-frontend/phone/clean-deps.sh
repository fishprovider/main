#!/bin/bash

cd ../../scripts

bash ./clean-frontend-deps.sh phone
node ./clean-root-dev-deps.cjs
