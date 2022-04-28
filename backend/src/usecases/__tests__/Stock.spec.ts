import 'reflect-metadata';
import IStockDto from '../data_tranfer_objects/IStockDto';
import IGetAllStocksUseCase from '../Stocks/IGetAllStocksUseCase';
import { mock } from "jest-mock-extended";
import dotenv from 'dotenv';

import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import Stock from '../entities/Stock';
import GetAllStocksUseCase from '../Stocks/GetAllStocksUseCase';
import FakeStockReadOnlyRepository from '../../infrastructure/FakeStockReadOnlyRepository';
import FakeLargeStockData from '../../infrastructure/FakeLargeStockData';
import GetOneStockUseCase from '../Stocks/GetOneStockUseCase';
import IGetOneStockUseCase from '../Stocks/IGetOneStockUseCase';
import ICreateStockUseCase from '../Stocks/ICreateStockUseCase';
import CreateStockUseCase from '../Stocks/CreateStockUseCase';
import MarketSimulatorUseCase from '../Stocks/MarketSimulatorUseCase';
import ISocketServer from '../../infrastructure/ISocketServer';
import SocketServer from '../../infrastructure/SocketServer';
import { EventEmitter } from 'stream';
import FakeStockWriteOnlyRepository from '../../infrastructure/FakeStockWriteOnlyRepository';

describe('Stock Use Cases', () => {
	let stockReadOnlyRepository: IStockReadOnlyRepository = mock<IStockReadOnlyRepository>();
	let stockWriteOnlyRepository: IStockWriteOnlyRepository = mock<IStockWriteOnlyRepository>();

	dotenv.config();

	beforeAll(async () => {
		mock(stockReadOnlyRepository).fetchAll.mockResolvedValue([new Stock("teststock1id", "teststock1symbol", "teststock1name", 434243, 44324324, 4324324, 43242), new Stock("teststock2id", "teststock2symbol", "teststock2name", 434243, 44324324, 4324324, 43242), new Stock("teststock3id", "teststock3symbol", "teststock3name", 434243, 44324324, 4324324, 43242)]);
	});
	it('Get list of stocks', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke();

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 43242,
			"gains": -3890081,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 4324324,
			"symbol": "teststock1symbol",
			"value": 434243,
			"volume": 44324324
		}, {
			"close": 43242,
			"gains": -3890081,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 4324324,
			"symbol": "teststock2symbol",
			"value": 434243,
			"volume": 44324324
		}, {
			"close": 43242,
			"gains": -3890081,
			"id": "teststock3id",
			"name": "teststock3name",
			"open": 4324324,
			"symbol": "teststock3symbol",
			"value": 434243,
			"volume": 44324324
		}]));
	})
	it('Get list of stocks based on stock symbol', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			symbol: "teststock1symbol",
			id: '',
			name: ''
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}]));
		expect(stockDto.length).toBe(1);
	})

	it('Get list of stocks based on stock name', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			symbol: '',
			id: '',
			name: 'teststock2name'
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 350,
			"gains": -150,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 650,
			"symbol": "teststock2symbol",
			"value": 500,
			"volume": 230000
		}]));
		expect(stockDto.length).toBe(1);
	})

	it('Get list of stocks based on gains less than', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			gains: 100,
			id: '',
			name: '',
			symbol: ''
		}, {
			gainsMode: 0
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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
		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks based on gains equal to', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			gains: -150,
			id: '',
			name: '',
			symbol: ''
		}, {
			gainsMode: 1
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 350,
			"gains": -150,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 650,
			"symbol": "teststock2symbol",
			"value": 500,
			"volume": 230000
		}]));
		expect(stockDto.length).toBe(1);
	})

	it('Get list of stocks based on gains greater than', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			gains: 50,
			id: '',
			name: '',
			symbol: ''
		}, {
			gainsMode: 2
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}, {
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock3id",
			"name": "teststock3name",
			"open": 898.5,
			"symbol": "teststock3symbol",
			"value": 956.9,
			"volume": 6000
		}]));
		expect(stockDto.length).toBe(2);
	})

	it('Get list of stocks based on value less than', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			value: 501,
			id: '',
			name: '',
			symbol: ''
		}, {
			valueMode: 0
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}]));
		expect(stockDto.length).toBe(2);
	})

	it('Get list of stocks based on value equal to', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			value: 500,
			id: '',
			name: '',
			symbol: ''
		}, {
			valueMode: 1
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}]));
		expect(stockDto.length).toBe(2);
	})

	it('Get list of stocks based on volume less than', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			volume: 6000,
			id: '',
			name: '',
			symbol: ''
		}, {
			volumeMode: 0
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}]));
		expect(stockDto.length).toBe(1);
	})

	it('Get list of stocks based on volume equal to', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			volume: 100,
			id: '',
			name: '',
			symbol: ''
		}, {
			volumeMode: 1
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}]));
		expect(stockDto.length).toBe(1);
	})

	it('Get list of stocks based on volume greater than', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke({
			volume: 100,
			id: '',
			name: '',
			symbol: ''
		}, {
			volumeMode: 2
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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
		}]));
		expect(stockDto.length).toBe(3);
	})
	it('Get list of stocks ordered in ascending by value', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'value', 
				orderDirection: 1
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}, {
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}, {
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock3id",
			"name": "teststock3name",
			"open": 898.5,
			"symbol": "teststock3symbol",
			"value": 956.9,
			"volume": 6000
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in descending by value', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'value', 
				orderDirection: 0
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
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
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in ascending by volume', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'volume', 
				orderDirection: 1
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}, {
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
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
			"close": 350,
			"gains": -150,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 650,
			"symbol": "teststock2symbol",
			"value": 500,
			"volume": 230000
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in descending by volume', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'volume', 
				orderDirection: 0
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
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

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in ascending by symbol', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'symbol', 
				orderDirection: 1
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in descending by symbol', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'symbol', 
				orderDirection: 0
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
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
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in ascending by open', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'open', 
				orderDirection: 1
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
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

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in descending by open', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'open', 
				orderDirection: 0
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
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
		}, {
			"close": 350,
			"gains": -150,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 650,
			"symbol": "teststock2symbol",
			"value": 500,
			"volume": 230000
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in ascending by name', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'name', 
				orderDirection: 1
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in descending by name', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'name', 
				orderDirection: 0
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
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
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in ascending by id', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'id', 
				orderDirection: 1
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in descending by id', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();


		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'id', 
				orderDirection: 0
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
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
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in ascending by gains', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();

		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'gains', 
				orderDirection: 1
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
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
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}, {
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock3id",
			"name": "teststock3name",
			"open": 898.5,
			"symbol": "teststock3symbol",
			"value": 956.9,
			"volume": 6000
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in descending by gains', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();

		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'gains', 
				orderDirection: 0
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
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
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in ascending by close', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();

		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'close', 
				orderDirection: 1
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
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
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
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

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks ordered in descending by gains', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];

		stockReadOnlyRepository = new FakeStockReadOnlyRepository();

		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			order: {
				orderBy: 'close', 
				orderDirection: 0
			}
		});

		// Assert
		expect(stockDto).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
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
		}, {
			"close": 350,
			"gains": -150,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 650,
			"symbol": "teststock2symbol",
			"value": 500,
			"volume": 230000
		}]));

		expect(stockDto.length).toBe(4);
	})

	it('Get list of stocks with pagination', async () => {
		// Arrange
		let getAllStocksUseCase: IGetAllStocksUseCase;
		let stockDto: IStockDto[];
		let paginatedData = FakeLargeStockData.slice((1*10)-1, (2*10)-1);
		const stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		
		mock(stockReadOnlyRepository).fetch.mockResolvedValue(paginatedData);

		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getAllStocksUseCase.invoke(undefined, {
			page: 3
		});

		// Assert
		expect(stockDto).toStrictEqual(paginatedData);

		expect(stockDto.length).toBe(10);
	})

	it('Get singular stock from id', async () => {
		// Arrange
		let getOneStockUseCase: IGetOneStockUseCase;
		let stockDto: IStockDto;
		let mockStock = <IStockDto>FakeLargeStockData.find(stock => {stock.id === 'teststock1id'});
		let mockResult: IStockDto[] = [];
		mockResult.push(mockStock);
		const stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		
		mock(stockReadOnlyRepository).fetch.mockResolvedValue(mockResult);

		getOneStockUseCase = new GetOneStockUseCase(stockReadOnlyRepository);

		// Act
		stockDto = await getOneStockUseCase.invoke({
			id: 'teststock1id',
			symbol: '',
			name: ''
		});

		// Assert
		expect(stockDto).toStrictEqual(mockStock);
	})

	it('Create stock use case', async () => {
		// Arrange
		let createStockUseCase: ICreateStockUseCase;
		let stockDto: IStockDto;
		const stockWriteOnlyRepository = mock<IStockWriteOnlyRepository>();
		
		mock(stockWriteOnlyRepository).create.mockResolvedValue({
			id: 'testaddedstockid',
			symbol: 'testaddedstocksymbol',
			name: 'testaddedstockname',
			volume: 50000,
			value: 45.6,
			open: 41.2,
			close: 39.6
		});

		createStockUseCase = new CreateStockUseCase(stockWriteOnlyRepository);

		// Act
		stockDto = await createStockUseCase.invoke({
			id: 'testaddedstockid',
			symbol: 'testaddedstocksymbol',
			name: 'testaddedstockname',
			volume: 50000,
			value: 45.6,
			open: 41.2,
			close: 39.6
		});

		// Assert
		expect(stockDto).toStrictEqual({
			id: 'testaddedstockid',
			symbol: 'testaddedstocksymbol',
			name: 'testaddedstockname',
			volume: 50000,
			value: 45.6,
			open: 41.2,
			close: 39.6
		});
	})

	it('Market simulator', () => {
		// Arrange
		let marketSimulatorUseCase: MarketSimulatorUseCase;
		let getAllStocksUseCase: GetAllStocksUseCase
		let stockDto: IStockDto;
		let socketServer: ISocketServer;
		const stockWriteOnlyRepository = mock<IStockWriteOnlyRepository>();
		
		mock(stockWriteOnlyRepository).create.mockResolvedValue({
			id: 'testaddedstockid',
			symbol: 'testaddedstocksymbol',
			name: 'testaddedstockname',
			volume: 50000,
			value: 45.6,
			open: 41.2,
			close: 39.6
		});
		
		socketServer = new SocketServer();
		getAllStocksUseCase = new GetAllStocksUseCase(stockReadOnlyRepository);
		
		marketSimulatorUseCase = new MarketSimulatorUseCase(socketServer, stockWriteOnlyRepository, getAllStocksUseCase);

		// Act
		//runMarketSimulator();
		
		// Assert
		let responseOne: IStockDto[];
		socketServer.server.once('stockData', (response)=>{
			responseOne = response;
		})

		socketServer.server.once('stockData', (response)=>{
			expect(responseOne === response).toBeFalsy();
		})
		
	});
})

async function runMarketSimulator () {
	let stockWriteOnlyRepository = new FakeStockWriteOnlyRepository()
	let stockReadOnlyRepository = new FakeStockReadOnlyRepository()
	let marketSimulatorUseCase = new MarketSimulatorUseCase(new SocketServer, stockWriteOnlyRepository, new GetAllStocksUseCase(stockReadOnlyRepository));
	await marketSimulatorUseCase.invoke();
}