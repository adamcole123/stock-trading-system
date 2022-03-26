import "reflect-metadata";
import * as bodyParser from 'body-parser';
import * as express from "express";
import { InversifyExpressServer, getRouteInfo, RouteInfo } from 'inversify-express-utils';
import { TYPES } from './constants/types';
import dotenv from 'dotenv';
import * as prettyjson from "prettyjson";

// declare metadata by @controller annotation
import "./entrypoint/controllers/UserController";
import UserReadOnlyRepository from './infrastructure/FakeUserReadOnlyRepository';
import UserWriteOnlyRepository from './infrastructure/FakeUserWriteOnlyRepository';
import StockReadOnlyRepository from './infrastructure/FakeStockReadOnlyRepository';
import StockWriteOnlyRepository from './infrastructure/FakeStockWriteOnlyRepository';
import { Container } from 'inversify';
import UserServiceLocator from './configuration/UserServiceLocator';
import IUserReadOnlyRepository from "./application/repositories/IUserReadOnlyRepository";
import IUserWriteOnlyRepository from "./application/repositories/IUserWriteOnlyRepository";
import IStockReadOnlyRepository from './application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from './application/repositories/IStockWriteOnlyRepository';
import StockServiceLocator from "./configuration/StockServiceLocator";

// set up container
const container = new Container();

// set up bindings
container.bind<UserServiceLocator>(TYPES.UserServiceLocator).to(UserServiceLocator);
container.bind<IUserReadOnlyRepository>(TYPES.IUserReadOnlyRepository).to(UserReadOnlyRepository);
container.bind<IUserWriteOnlyRepository>(TYPES.IUserWriteOnlyRepository).to(UserWriteOnlyRepository);

container.bind<StockServiceLocator>(TYPES.StockServiceLocator).to(StockServiceLocator);
container.bind<IStockReadOnlyRepository>(TYPES.IStockReadOnlyRepository).to(StockReadOnlyRepository);
container.bind<IStockWriteOnlyRepository>(TYPES.IStockWriteOnlyRepository).to(StockWriteOnlyRepository);

dotenv.config();

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app: express.Application) => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
});

let app = server.build();

const routeInfo = getRouteInfo(container);

app.listen(8000, () => {
  console.log('Server listening on port 8000');
  console.log(prettyjson.render({ routes: routeInfo }));
});