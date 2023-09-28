#!/bin/bash

bash ./build-deps.sh

cd ..

ls -1 apps-backend | while read app; do
  npm run type-check -w apps-backend/$app &
done
wait

ls -1 apps-frontend | while read app; do
  npm run type-check -w apps-frontend/$app &
done
wait
