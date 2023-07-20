#!/bin/bash

cd ..

function adapters() {
  npm run build -w adapters/backend &
  # npm run build -w adapters/frontend &
  wait
}

function frameworks() {
  npm run build -w frameworks/mongo &
  npm run build -w frameworks/redis &
  wait

  npm run build -w frameworks/cache-first
}

npm run build -w packages/enterprise-rules
npm run build -w packages/application-rules

adapters &
frameworks &
wait
