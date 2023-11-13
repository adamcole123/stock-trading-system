#! /bin/bash

echo "Checking status of MongoDB instances..."

for host in mongo1 mongo2 mongo3
do
  echo "Checking $host..."
  until mongo --host $host:27017 --eval "print(\"waited for connection\")"
  do
    sleep 5
  done
done

echo "All MongoDB instances are ready. Initiating replica set..."

mongo --host mongo1:27017 <<EOF
  var cfg = {
    "_id": "rs0",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "mongo1:27017",
        "priority": 2
      },
      {
        "_id": 1,
        "host": "mongo2:27017",
        "priority": 0
      },
      {
        "_id": 2,
        "host": "mongo3:27017",
        "priority": 0
      }
    ]
  };
  rs.initiate(cfg);
EOF
