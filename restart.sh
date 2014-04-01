#!/bin/bash
ps -efa |grep node | awk '{print $2}' | xargs kill -9
dtach -A /tmp/server.dtach node master.js
