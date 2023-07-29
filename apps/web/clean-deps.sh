#!/bin/bash

cd ../../scripts

bash ./clean-frontend-deps.sh web
node ./clean-root-dev-deps.js
