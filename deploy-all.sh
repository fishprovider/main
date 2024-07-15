#!/bin/bash

./deploy.sh bot; ./deploy.sh copy; ./deploy.sh cron
# ./deploy.sh pay; ./deploy.sh gate; ./deploy.sh mon
./deploy.sh head-ctrader; ./deploy.sh head-meta
./deploy.sh spot-ctrader; ./deploy.sh spot-meta
./deploy.sh spot-ctrader-poll; ./deploy.sh spot-meta-poll
./deploy.sh back; ./deploy.sh back-secondary
./deploy.sh web; ./deploy.sh web-secondary
