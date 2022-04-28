#! /bin/bash
mongoimport --host=stock-trading-system-db --db=stock-trading-system-db --collection=stocks --type=csv --headerline --file=/mongo-seed/MOCK_DATA.csv