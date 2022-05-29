import 'reflect-metadata';
import { cleanUpMetadata, interfaces, InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { TYPES } from '../../../constants/types';
import { mockedHttpContext } from '../MockHttpContext';
import dotenv from 'dotenv';
import httpMocks from 'node-mocks-http';
import StockController from '../StockController';
import StockServiceLocator from '../../../configuration/StockServiceLocator';
import IStockReadOnlyRepository from '../../../application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from '../../../application/repositories/IStockWriteOnlyRepository';
import EmailServiceLocator from '../../../configuration/EmailServiceLocator';
import { mock } from 'jest-mock-extended';

// set up container
const container = new Container();
describe('StockController Tests', () => {
	let controller: StockController;

	let stockWriteOnlyRepository: IStockWriteOnlyRepository = mock<IStockWriteOnlyRepository>();
	let stockReadOnlyRepository: IStockReadOnlyRepository = mock<IStockReadOnlyRepository>();

	// set up bindings
	container.bind<StockServiceLocator>(TYPES.StockServiceLocator).to(StockServiceLocator);
	container.bind<EmailServiceLocator>(TYPES.EmailServiceLocator).to(EmailServiceLocator);
	container.bind<IStockReadOnlyRepository>(Symbol.for("IStockReadOnlyRepository")).toConstantValue(stockReadOnlyRepository);
	container.bind<IStockWriteOnlyRepository>(Symbol.for("IStockWriteOnlyRepository")).toConstantValue(stockWriteOnlyRepository);
	container.bind<interfaces.HttpContext>(Symbol.for("HttpContext")).toConstantValue(mockedHttpContext);

	beforeAll(async () => {
		jest.clearAllMocks();
		cleanUpMetadata();
		dotenv.config();
		controller = new StockController(container.get<StockServiceLocator>(Symbol.for("StockServiceLocator")));
	});

	it('Stock get one route', async () => {

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
			id: "teststock1id",
			symbol: "teststock1symbol",
			name: "teststock1name",
			value: 956.9,
			volume: 6000,
			open: 898.5,
			close: 967.2
		}])

		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/stocks/getOne',
			query: {
				"id": "teststock2id",
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.getStock(requestObj, responseObj);

		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining({
			"close": 967.2,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000,
		}));
	})

	it('Stock get all route', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/stocks/getMany',
			body: {}
		});

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}, {
			"close": 350,
			"gains": -150,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 650,
			"symbol": "teststock2symbol",
			"value": 500,
			"volume": 230000
		}, {
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock3id",
			"name": "teststock3name",
			"open": 898.5,
			"symbol": "teststock3symbol",
			"value": 956.9,
			"volume": 6000
		}, {
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}])

		let responseObj = httpMocks.createResponse();

		await controller.getStocks(requestObj, responseObj);

		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}, {
			"close": 350,
			"gains": -150,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 650,
			"symbol": "teststock2symbol",
			"value": 500,
			"volume": 230000
		}, {
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock3id",
			"name": "teststock3name",
			"open": 898.5,
			"symbol": "teststock3symbol",
			"value": 956.9,
			"volume": 6000
		}, {
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}]));
	})

	it('Create stock route', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/stocks/getOne',
			body: {
				"close": 85,
				"id": "teststockid",
				"name": "teststockname",
				"open": 25,
				"symbol": "teststocksymbol",
				"value": 52,
				"volume": 800
			}
		});

		mock(stockWriteOnlyRepository).create.mockResolvedValue({
			"close": 85,
			"id": "teststockid",
			"name": "teststockname",
			"open": 25,
			"symbol": "teststocksymbol",
			"value": 52,
			"volume": 800
		})

		let responseObj = httpMocks.createResponse();

		await controller.createStock(requestObj, responseObj);

		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining({
			"close": 85,
			"id": "teststockid",
			"name": "teststockname",
			"open": 25,
			"symbol": "teststocksymbol",
			"value": 52,
			"volume": 800
		}));
	})
	it('Edit stock route', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/stocks/edit',
			body: {
				"close": 85,
				"id": "teststockid",
				"name": "teststockname",
				"open": 25,
				"symbol": "teststocksymbol",
				"value": 52,
				"volume": 850
			}
		});

		mock(stockWriteOnlyRepository).edit.mockResolvedValue([{
			"close": 85,
			"id": "teststockid",
			"name": "teststockname",
			"open": 25,
			"symbol": "teststocksymbol",
			"value": 52,
			"volume": 850
		}])

		let responseObj = httpMocks.createResponse();

		await controller.editStock(requestObj, responseObj);

		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining({
			"close": 85,
			"id": "teststockid",
			"name": "teststockname",
			"open": 25,
			"symbol": "teststocksymbol",
			"value": 52,
			"volume": 850,
		}));
	})
});