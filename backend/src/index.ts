import "reflect-metadata";
import * as bodyParser from 'body-parser';
import * as express from "express";
import { InversifyExpressServer, getRouteInfo } from 'inversify-express-utils';
import { interfaces, InversifySocketServer, TYPE } from "inversify-socket-utils";
import { TYPES } from './constants/types';
import dotenv from 'dotenv';
import * as prettyjson from "prettyjson";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { SocketController } from "./SocketController";
import * as SocketIO from 'socket.io';


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
import TradeReadOnlyRepository from "./infrastructure/Trade/TradeReadOnlyRepository";
import ITradeReadOnlyRepository from "./application/repositories/ITradeReadOnlyRepository";
import ReportServiceLocator from "./configuration/ReportServiceLocator";
import ISendEmailUseCase from './usecases/Email/ISendEmailUseCase';
import SendEmailUseCase from './usecases/Email/SendEmailUseCase';
import EmailServiceLocator from './configuration/EmailServiceLocator';

// set up container
const container = new Container();

var allowedOrigins = ['http://localhost:8080', 'http://localhost:8081'];

// declare metadata by @controller annotation
import "./entrypoint/controllers/UserController";
import "./entrypoint/controllers/StockController";
import "./entrypoint/controllers/TradeController";
import "./entrypoint/controllers/ReportController";

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

// Binding for socket server
container.bind<interfaces.Controller>(TYPE.Controller).to(SocketController).whenTargetNamed('SocketController');

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
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack)
    
    let sendEmailUseCase: ISendEmailUseCase = new SendEmailUseCase();

    sendEmailUseCase.invoke({
      to: ["admin@stock-trading-system.com"],
      from: "error-logger@stock-trading-system.com",
      subject: "An error was caused in the system",
      bodyText: `${err} with request ${req} and response ${res}`,
      bodyHtml: `${err}<br />with request ${req}<br />and response ${res}`
    })
  })
});

let app = server.build();

// const routeInfo = getRouteInfo(container);

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

import Stock from './infrastructure/Stock/Stock';

console.log(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
.then(res => {
  console.log('Connected to database');

  changeStockValues();
})
.catch(err => {
  console.error(err)
})



const httpServer = app.listen(8000, () => {
  console.log('Server listening on port 8000');
  // console.log(prettyjson.render({ routes: routeInfo }));
});

const socketServer = new InversifySocketServer(container, new SocketIO.Server(httpServer, {
  cors: {
    origin: "http://localhost:8080"
  }
}))
socketServer.build();

function changeStockValues() {
  setInterval(function () {
    Stock.count().exec(function(err, count){
      var random = Math.floor(Math.random() * count);
    
      Stock.findOne().skip(random).exec(
        function (err, result) {
    
          if(err)
            return console.error(err);
  
          if(result?.value! > 0)
            result!.value = Number.parseFloat((result!.value! + (Math.random() > 0.5 ? Math.random() * 1 : Math.random() * -1)).toFixed(2));
          
          if(result?.volume! > 0)
            result!.volume = Math.round(result!.volume! + (Math.random() > 0.5 ? Math.random() * 10 : Math.random() * -10))
  
          if(result?.volume! < 0)
            return;
          
          result?.save()
          });
          
    });

    let now = new Date();

    if(now.getHours() === 8 && now.getMinutes() === 0 && now.getSeconds() === 0){
      Stock.find({}).snapshot()
      .then(docs => {
        docs.forEach( function (doc) {
          doc.open = doc.value;
          doc.save();
        });
      })
      .catch(err => {
        console.log(err);
      })
      
    }

    if(now.getHours() === 16 && now.getMinutes() === 30 && now.getSeconds() === 0){
      Stock.find({}).snapshot()
      .then(docs => {
        docs.forEach( function (doc) {
          doc.close = doc.value;
          doc.save();
        });
      })
      .catch(err => {
        console.log(err);
      })
    }
  }, 2);
}