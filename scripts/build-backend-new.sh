#!/bin/bash

MODE=$1

if [ "$MODE" = "build-share" ]; then
  bash ./build-share-new.sh
fi

cd ..

npm run build -w packages-backend/send-notif &
npm run build -w packages-backend/push-notif &
npm run build -w packages-backend/queue &
npm run build -w packages-backend/database &
wait
