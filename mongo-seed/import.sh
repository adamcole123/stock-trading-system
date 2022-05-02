#! /bin/bash
CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED
    echo "-- First container startup --"
    # YOUR_JUST_ONCE_LOGIC_HERE
	mongoimport --host=stock-trading-system-db --db=stock-trading-system-db --collection=stocks --type=csv --headerline --file=/mongo-seed/MOCK_DATA.csv \
    echo "replication:
  replSetName: "rs0"" >> /usr/local/etc/mongod.conf
else
    echo "-- Not first container startup --"
fi