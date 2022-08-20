import "reflect-metadata";
import * as bodyParser from 'body-parser';
import * as express from "express";
import { InversifyExpressServer, getRouteInfo } from 'inversify-express-utils';
import { interfaces, InversifySocketServer, TYPE } from "inversify-socket-utils";
import { Container } from 'inversify';
import { TYPES } from './constants/types';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { SocketController } from "./SocketController";
import * as swagger from "swagger-express-ts";
import * as SocketIO from 'socket.io';
import fs from 'fs';
import moment from "moment";
import modelDefinitions from './ModelDefinitions';

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
import TradeReadOnlyRepository from "./infrastructure/Trade/TradeReadOnlyRepository";
import ITradeReadOnlyRepository from "./application/repositories/ITradeReadOnlyRepository";
import ReportServiceLocator from "./configuration/ReportServiceLocator";
import ISendEmailUseCase from './usecases/Email/ISendEmailUseCase';
import EmailServiceLocator from './configuration/EmailServiceLocator';
import IEncrypter from './infrastructure/IEncrypter';
import Encrypter from './infrastructure/Encrypter';
import Stock from './infrastructure/Stock/Stock';

// set up container
const container = new Container();

var allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:8081',
  'http://127.0.0.1',
  'http://127.0.0.1:80',
  'http://localhost',
  'http://localhost:80'
];

// declare metadata by @controller annotation
import "./entrypoint/controllers/UserController";
import "./entrypoint/controllers/StockController";
import "./entrypoint/controllers/TradeController";
import "./entrypoint/controllers/ReportController";

import CreateStockUseCase from './usecases/Stocks/CreateStockUseCase';
import User from "./infrastructure/User/User";
import bcrypt from 'bcryptjs';
import SendRealEmailUseCase from "./usecases/Email/SendRealEmailUseCase";
import SendEmailUseCase from "./usecases/Email/SendEmailUseCase";
import morgan from "morgan";

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

container.bind<ReportServiceLocator>(TYPES.ReportServiceLocator).to(ReportServiceLocator);

container.bind<EmailServiceLocator>(TYPES.EmailServiceLocator).to(EmailServiceLocator);

container.bind<IEncrypter>(TYPES.IEncrypter).to(Encrypter);

let server = new InversifyExpressServer(container);


dotenv.config();

let sendRealEmailUseCase: ISendEmailUseCase;
if(process.env.GMAILBOOL === "true") {
  sendRealEmailUseCase = new SendRealEmailUseCase();
} else {
  sendRealEmailUseCase = new SendEmailUseCase();
}

// create server
server.setErrorConfig((app: express.Application) => {
  app.use((err: Error, req: express.Request, res: express.Response, nextFunc: express.NextFunction) => {
    console.log(prettyjson.render(err));

    sendRealEmailUseCase.invoke({
      to: ["admin@stock-trading-system.com"],
      from: "error-logger@stock-trading-system.com",
      subject: "An error was caused in the system",
      bodyText: `Error occured at ${moment(new Date()).format("DD/MM/YYYY hh:mm:ss")} with stack trace \n${err.stack}`,
      bodyHtml: `Error occured at ${moment(new Date()).format("DD/MM/YYYY hh:mm:ss")} with details:<br />Name: <pre>${err.name}</pre><br />Message: <pre>${err.message}</pre><br />Stack trace: <pre>${err.stack}</pre>`
    })
  });
});
server.setConfig((app: express.Application) => {
  app.use('/api-docs/swagger', express.static('swagger'));
  app.use(
    '/api-docs/swagger/assets',
    express.static('node_modules/swagger-ui-dist')
  );
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cors({
    credentials: true, // --> configures the Access-Control-Allow-Credentials CORS header
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(
    swagger.express({
      definition: {
        externalDocs: {
          url: 'My url',
        },
        info: {
          title: 'API documentation for the stock trading system',
          version: '1.0',
        },
        responses: {
          500: {},
        },
        models: modelDefinitions
      },
    })
  );
  app.use(morgan("tiny"));
});

process.on('uncaughtExceptionMonitor', err => {
  console.error('There was an uncaught error: ', err);
  sendRealEmailUseCase.invoke({
    to: ["admin@stock-trading-system.com"],
    from: "error-logger@stock-trading-system.com",
    subject: "An error was caused in the system",
    bodyText: `There was an uncaught error: ${err}`,
    bodyHtml: `There was an uncaught error:<br />${err}`
  })
});

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

let app = server.build();

const routeInfo = getRouteInfo(container);

// Binding for socket server
container.bind<interfaces.Controller>(TYPE.Controller).to(SocketController).whenTargetNamed('SocketController');

console.log(`Attempting to connect to mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
  .then(async res => {
    console.log('Connected to database');
    await initDb();
    changeStockValues();
  })
  .catch(err => {
    console.error(err);
  })

const httpServer = app.listen(8000, () => {
  console.log('Server listening on port 8000');
});

const socketServer = new InversifySocketServer(container, new SocketIO.Server(httpServer, {
  cors: {
    origin: "*"
  }
}))
socketServer.build();

async function changeStockValues() {
  if (await Stock.count() < 1) {
    console.log('Cannot start market simulator');
    return;
  }
  setInterval(async function () {
    Stock.count().exec(function (err, count) {
      var random = Math.floor(Math.random() * count);

      Stock.findOne().skip(random).exec(
        function (err, result) {

          if (err)
            return console.error(err);

          if (result?.value! > 0) {
            result!.value = Number.parseFloat((result!.value! + (Math.random() > 0.5 ? Math.random() * 1 : Math.random() * -1)).toFixed(2));
            if (result!.value < 0)
              result!.value = 0.5;
          } else {
            result!.value = 0.5;
          }

          if (result?.volume! > 0)
            result!.volume = Math.round(result!.volume! + (Math.random() > 0.5 ? Math.random() * 10 : Math.random() * -10))

          if (result?.volume! < 0)
            return;

          result!.latest_trade = new Date();

          result?.save()
        });

    });

    let now = new Date();

    if (now.getHours() === 8 && now.getMinutes() === 0 && now.getSeconds() === 0) {
      await Stock.updateMany(
        {},
        [{ $set: { open: "$value" } }]
      )
    }

    if (now.getHours() === 16 && now.getMinutes() === 30 && now.getSeconds() === 0) {
      await Stock.updateMany(
        {},
        [{ $set: { close: "$value" } }]
      )
    }
  }, 2);
}

async function initDb(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    if (await Stock.count() < 10) {
      console.warn('Generating stock data');
      fs.readFile('./stockdata.json', 'utf-8', (err, data) => {
        let createStockUseCase = new CreateStockUseCase(new StockWriteRepository());
        let stockData: { [key: string]: { name: string, symbol: string }[] } = JSON.parse(data);
        stockData.stocks.forEach(stock => {
          createStockUseCase.invoke(stock);
        });
      });
    } else {
      console.warn('Skipping stock data generation');
    }
    if (!(await User.exists({
      email: "admin@stocktradingsystem.com"
    }))) {
      console.warn('Generating admin account');
      await User.create({
        "username": "admin",
        "email": "admin@stocktradingsystem.com",
        "firstName": "Admin",
        "lastName": "Account",
        "reports": [],
        "password": await bcrypt.hashSync("Password1!", await bcrypt.genSalt(10)),
        "credit": 50000,
        "role": "Admin",
        "isDeleted": false,
        "cardDetails": [],
        "activationDate": new Date(),
      })
      await User.create({
        "username": "user",
        "email": "user@stocktradingsystem.com",
        "firstName": "User",
        "lastName": "Account",
        "reports": [],
        "password": await bcrypt.hashSync("Password1!", await bcrypt.genSalt(10)),
        "credit": 50000,
        "role": "User",
        "isDeleted": false,
        "cardDetails": [],
        "activationDate": new Date(),
      })
      await User.create({
        "username": "broker",
        "email": "broker@stocktradingsystem.com",
        "firstName": "Broker",
        "lastName": "Account",
        "reports": [],
        "password": await bcrypt.hashSync("Password1!", await bcrypt.genSalt(10)),
        "credit": 50000,
        "role": "Broker",
        "isDeleted": false,
        "cardDetails": [],
        "activationDate": new Date(),
      })
    } else {
      console.warn('Skipping generating admin account');
    }
    resolve(true);
  });
}