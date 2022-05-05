#!/bin/bash
echo ******************************************
echo Starting the replica set
echo ******************************************

sleep 20 | echo Sleeping
mongo mongodb://stock-trading-system-mongo-rs0-1:27017 replicaSet.js
mongoimport --host=mongo1 --db=stock-trading-system-db --collection=stocks --type=csv --headerline --file=/mongo-seed/configs/MOCK_DATA.csv 