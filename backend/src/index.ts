import "reflect-metadata";
import * as bodyParser from 'body-parser';
import * as express from "express";
import { InversifyExpressServer, getRouteInfo } from 'inversify-express-utils';
import { TYPES } from './constants/types';
import dotenv from 'dotenv';
import * as prettyjson from "prettyjson";
import cookieParser from 'cookie-parser';
import cors from 'cors';

// declare metadata by @controller annotation
import "./entrypoint/controllers/UserController";
import "./entrypoint/controllers/StockController";
import { Container } from 'inversify';
import UserServiceLocator from './configuration/UserServiceLocator';
import IUserReadOnlyRepository from "./application/repositories/IUserReadOnlyRepository";
import IUserWriteOnlyRepository from "./application/repositories/IUserWriteOnlyRepository";
import IStockReadOnlyRepository from './application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from './application/repositories/IStockWriteOnlyRepository';
import StockServiceLocator from "./configuration/StockServiceLocator";
import mongoose from 'mongoose';
import StockReadRepository from './infrastructure/Stock/StockReadRepository';
import UserReadRepository from './infrastructure/User/UserReadRepository';
import UserWriteRepository from './infrastructure/User/UserWriteRepository';
import StockWriteRepository from "./infrastructure/Stock/StockWriteRepository";

// set up container
const container = new Container();

// set up bindings
container.bind<UserServiceLocator>(TYPES.UserServiceLocator).to(UserServiceLocator);
container.bind<IUserReadOnlyRepository>(TYPES.IUserReadOnlyRepository).to(UserReadRepository);
container.bind<IUserWriteOnlyRepository>(TYPES.IUserWriteOnlyRepository).to(UserWriteRepository);

container.bind<StockServiceLocator>(TYPES.StockServiceLocator).to(StockServiceLocator);
container.bind<IStockReadOnlyRepository>(TYPES.IStockReadOnlyRepository).to(StockReadRepository);
container.bind<IStockWriteOnlyRepository>(TYPES.IStockWriteOnlyRepository).to(StockWriteRepository);

dotenv.config();

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app: express.Application) => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());
});

let app = server.build();

const routeInfo = getRouteInfo(container);

mongoose.connect('mongodb://localhost:27017/stock-trading-system-db')
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