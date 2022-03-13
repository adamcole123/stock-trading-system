import IStockDto from '../data_tranfer_objects/IStockDto';
import IGetAllStocksUseCase from '../Stocks/IGetAllStocksUseCase';
import { mock } from "jest-mock-extended";
import dotenv from 'dotenv';

import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import Stock from '../entities/Stock';
import GetAllStocksUseCase from '../Stocks/GetAllStocksUseCase';
import FakeStockReadOnlyRepository from '../../infrastructure/FakeStockReadOnlyRepository';
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
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 4324324,
			"symbol": "teststock1symbol",
			"value": 434243,
			"volume": 44324324
		}, {
			"close": 43242,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 4324324,
			"symbol": "teststock2symbol",
			"value": 434243,
			"volume": 44324324
		}, {
			"close": 43242,
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
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}]));
		expect(stockDto.length).toBe(1);
	})
})