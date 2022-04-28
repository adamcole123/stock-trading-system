import "reflect-metadata";
import * as bodyParser from 'body-parser';
import * as express from "express";
import { InversifyExpressServer, getRouteInfo } from 'inversify-express-utils';
import { TYPES } from './constants/types';
import dotenv from 'dotenv';
import * as prettyjson from "prettyjson";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';


import { Container } from 'inversify';
import UserServiceLocator from './configuration/UserServiceLocator';
import IUserReadOnlyRepository from "./application/repositories/IUserReadOnlyRepository";
import IUserWriteOnlyRepository from "./application/repositories/IUserWriteOnlyRepository";
import IStockReadOnlyRepository from './application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from './application/repositories/IStockWriteOnlyRepository';
import StockServiceLocator from "./configuration/StockServiceLocator";
import StockReadRepository from './infrastructure/Stock/StockReadRepository';
import UserReadRepository from './infrastructure/User/UserReadRepository';
import UserWriteRepository from './infrastructure/User/UserWriteRepository';
import StockWriteRepository from "./infrastructure/Stock/StockWriteRepository";
import TradeServiceLocator from './configuration/TradeServiceLocator';
import ITradeWriteOnlyRepository from "./application/repositories/ITradeWriteOnlyRepository";
import TradeWriteOnlyRepository from './infrastructure/Trade/TradeWriteOnlyRepository';

// set up container
const container = new Container();

var allowedOrigins = ['http://localhost:8080', 'http://localhost:8081'];

// declare metadata by @controller annotation
import "./entrypoint/controllers/UserController";
import "./entrypoint/controllers/StockController";
import "./entrypoint/controllers/TradeController";
import TradeReadOnlyRepository from "./infrastructure/Trade/TradeReadOnlyRepository";
import ITradeReadOnlyRepository from "./application/repositories/ITradeReadOnlyRepository";

// set up bindings
container.bind<UserServiceLocator>(TYPES.UserServiceLocator).to(UserServiceLocator);
container.bind<IUserReadOnlyRepository>(TYPES.IUserReadOnlyRepository).to(UserReadRepository);
container.bind<IUserWriteOnlyRepository>(TYPES.IUserWriteOnlyRepository).to(UserWriteRepository);

container.bind<StockServiceLocator>(TYPES.StockServiceLocator).to(StockServiceLocator);
container.bind<IStockReadOnlyRepository>(TYPES.IStockReadOnlyRepository).to(StockReadRepository);
container.bind<IStockWriteOnlyRepository>(TYPES.IStockWriteOnlyRepository).to(StockWriteRepository);

container.bind<TradeServiceLocator>(TYPES.TradeServiceLocator).to(TradeServiceLocator);
container.bind<ITradeWriteOnlyRepository>(TYPES.ITradeWriteOnlyRepository).to(TradeWriteOnlyRepository);
container.bind<ITradeReadOnlyRepository>(TYPES.ITradeReadOnlyRepository).to(TradeReadOnlyRepository);

dotenv.config();

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app: express.Application) => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cors({
    credentials: true, // --> configures the Access-Control-Allow-Credentials CORS header
    origin: function(origin, callback){
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);      
    }
  }));
  app.use(bodyParser.json());
  app.use(cookieParser());
});

let app = server.build();

const routeInfo = getRouteInfo(container);

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
.then(res => {
  console.log('Connected to database');
})
.catch(err => {
  console.error(err)
})

app.listen(8000, () => {
  console.log('Server listening on port 8000');
  console.log(prettyjson.render({ routes: routeInfo }));
});