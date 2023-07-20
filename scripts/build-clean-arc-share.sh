#!/bin/bash

cd ..

npm run build -w packages/enterprise-rules
npm run build -w packages/application-rules
