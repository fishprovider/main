#!/bin/bash

export HUSKY=0
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export N_PREFIX="$HOME/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"

source ~/pm2rc.sh || echo "No ~/pm2rc.sh found"
