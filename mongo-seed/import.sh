#! /bin/bash

mongoimport --host=mongo1 --db=stock-trading-system-db --collection=stocks --type=csv --headerline --file=/mongo-seed/MOCK_DATA.csv 