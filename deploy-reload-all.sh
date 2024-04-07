#!/bin/bash

./deploy-reload.sh bot; ./deploy-reload.sh copy; ./deploy-reload.sh pay
./deploy-reload.sh cron; ./deploy-reload.sh gate; ./deploy-reload.sh mon
./deploy-reload.sh head-ctrader; ./deploy-reload.sh head-meta
./deploy-reload.sh spot-ctrader; ./deploy-reload.sh spot-meta
./deploy-reload.sh spot-ctrader-poll; ./deploy-reload.sh spot-meta-poll
./deploy-reload.sh back; ./deploy-reload.sh back-secondary
./deploy-reload.sh web; ./deploy-reload.sh web-secondary
