# Stock Trading System
This is the implementation of my MSc second year project, a stock trading system

# Installation

## Requirements
- Node.js > v14.15.4
- Docker
- NPM
- MongoDB > v5.0


## Commands
To get the app running, run the following command

***Docker is not yet set up properly in this project, follow the local setup steps***

	> cd stock-trading-system
	> docker-compose up

## Local Setup

### Before 'getting the app running'!
1. Navigate to your mongod.cfg, usually in the `C:\Program Files\MongoDB\Server\5.0\bin` directory if you're using a windows machine
2. Add the following to the document
```
replication:
  replSetName: "rs0"
```
3. Windows->Task Manager->Services->MongoDB [run restart]
4. Execute this command: `mongo 127.0.0.1:27017`
5. then this command: `rs.initiate()`
6. If you see a response like this, then you can start the backend and frontend applications:

```
"info2" : "no configuration specified. Using a default configuration for the set",    
"me" : "127.0.0.1:27017",                                                             
"ok" : 1,                                                                             
"$clusterTime" : {                                                                    
	"clusterTime" : Timestamp(1584218777, 1),                                     
	"signature" : {                                                               
		"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),                   
		"keyId" : NumberLong(0)                                               
	}                                                                             
},                                                                                    
"operationTime" : Timestamp(1584218777, 1)
```

**why?**

The live stock updates implemented in this application use the MongoDB change stream functionality to watch updates to the database. This functionality requires MongoDB replica sets, which is what the above steps accomplish.

### Get the app running
Follow these instructions to get the app working

1. Open up MongoDB compass
2. Connect to mongodb://localhost:27017
 - If your local mongodb service isn't running on port 27017 then connect to that port instead and change the .env file inside the `stock-trading-system/backend/` to reflect this port in the `DB_URI` variable.
3. Create a new database called `stock-trading-system-db` (This will happen automatically if you follow the steps for docker)
4. Create a collection inside this database called `stocks`
5. Open the stocks database and select Import->Import file->Select file
6. Open the file named `MOCK_DATA.csv` inside the `stock-trading-system/mongo-seed/` directory
7. Select `CSV` as the file type
8. In the same window, for `open`, `close`, and `value`, change the data type to `Decimal128`
9. For `volume` change the data type to `Int32`
10. Leave all other settings as their defaults and select import
11. Run the following commands from the `stock-trading-system` parent directory in an elevated terminal

		> cd stock-trading-system
		> cd backend
		> npm install
		> npm run start
		> cd ..
		> cd frontend
		> npm install
		> npm run serve

If you have errors running the last command, due to formatting issues, run the following command from the frontend directory

		> npm run lint --fix

Assuming there are no errors, you should be able to access `localhost:8080` in a browser and start using the app.
