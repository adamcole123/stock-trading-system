import "reflect-metadata";
import * as bodyParser from 'body-parser';
import * as express from "express";
import { InversifyExpressServer } from 'inversify-express-utils';
import { TYPES } from './constants/types';
import dotenv from 'dotenv';

// declare metadata by @controller annotation
import "./entrypoint/controllers/UserController";
import UserReadOnlyRepository from './infrastructure/FakeUserReadOnlyRepository';
import UserWriteOnlyRepository from './infrastructure/FakeUserWriteOnlyRepository';
import { Container } from 'inversify';
import UserServiceLocator from './configuration/UserServiceLocator';
import IUserReadOnlyRepository from "./application/repositories/IUserReadOnlyRepository";
import IUserWriteOnlyRepository from "./application/repositories/IUserWriteOnlyRepository";

// set up container
const container = new Container();

// set up bindings
container.bind<UserServiceLocator>(TYPES.UserServiceLocator).to(UserServiceLocator);
container.bind<IUserReadOnlyRepository>(TYPES.IUserReadOnlyRepository).to(UserReadOnlyRepository);
container.bind<IUserWriteOnlyRepository>(TYPES.IUserWriteOnlyRepository).to(UserWriteOnlyRepository);

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
app.listen(8000, () => {
  console.log('Server listening on port 8000');
});

