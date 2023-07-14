#!/bin/bash

grep node_modules dist -rnq || exit 0 && echo 'node_modules found in dist' && exit 1
