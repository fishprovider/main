#!/bin/bash

cd ../..

ls adapters | grep -vE "frontend" | xargs rm -rf
ls apps | grep -vE "phone" | xargs rm -rf
ls frameworks | grep -vE "local|store|fish-api|offline-first" | xargs rm -rf
ls packages | grep -vE "utils|cross|enterprise-rules|application-rules" | xargs rm -rf
rm -rf workers
