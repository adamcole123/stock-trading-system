import 'reflect-metadata';

import BuyStocksUseCase from "../Trades/BuyStocksUseCase";
import FakeTradeWriteOnlyRepository from './../../infrastructure/FakeTradeWriteOnlyRepository';
import FakeStockWriteOnlyRepository from '../../infrastructure/FakeStockWriteOnlyRepository';
import FakeStockReadOnlyRepository from '../../infrastructure/FakeStockReadOnlyRepository';

import ITradeDto from "../data_tranfer_objects/ITradeDto";
import IBuyStocksUseCase from "../Trades/IBuyStocksUseCase";
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import IStockReadOnlyRepository from "../../application/repositories/IStockReadOnlyRepository";
import { mock } from 'jest-mock-extended';
import ISellStocksUseCase from '../Trades/ISellStocksUseCase';
import SellStocksUseCase from '../Trades/SellStocksUseCase';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import bcrypt from 'bcryptjs';
import Report from '../entities/Report';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import FakeUserReadOnlyRepository from '../../infrastructure/FakeUserReadOnlyRepository';

let tradeWriteOnlyRepository: ITradeWriteOnlyRepository;
let stockWriteOnlyRepository: IStockWriteOnlyRepository;
let stockReadOnlyRepository: IStockReadOnlyRepository;
let userWriteOnlyRepository: IUserWriteOnlyRepository;
let userReadOnlyRepository: IUserReadOnlyRepository;

describe("Trade Tests", () => {
	beforeEach(() => {
		tradeWriteOnlyRepository = new FakeTradeWriteOnlyRepository();
		stockWriteOnlyRepository = new FakeStockWriteOnlyRepository();
		stockReadOnlyRepository = new FakeStockReadOnlyRepository();
		userReadOnlyRepository = new FakeUserReadOnlyRepository();
	})
	it("Buy stocks use case", async () => {
		//Arrange
		let buyStocksUseCase: IBuyStocksUseCase;
		let tradeDto: ITradeDto;

		stockWriteOnlyRepository = mock<IStockWriteOnlyRepository>();
		tradeWriteOnlyRepository = mock<ITradeWriteOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();

		mock(stockWriteOnlyRepository).edit.mockResolvedValue([{
			id: "teststock1id",
			symbol: "teststock1symbol",
			name: "teststock1name",
			value: 956.9,
			volume: 6000,
			open: 898.5,
			close: 967.2
		}])


		let newDate = new Date();


		mock(tradeWriteOnlyRepository).create.mockResolvedValue({
			user_id: "testid1",
			stock_id: "teststock1id",
			stock_amount: 50,
			stock_value: 956.9,
			time_of_trade: newDate,
		})

		mock(userWriteOnlyRepository).edit.mockResolvedValue({
			username: "test1_username", 
			email: "test1email@test.com", 
			firstName: "test1fname", 
			lastName: "test1lname", 
			birthDate: new Date(), 
			reports: [
				new Report("report1id", ",,,", 1),
				new Report("report2id", ",,,", 0),
				new Report("report3id", ",,,", 1),
				new Report("report4id", ",,,", 1)
			], 
			id: "test1_id", 
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			username: "test1_username", 
			email: "test1email@test.com", 
			firstName: "test1fname", 
			lastName: "test1lname", 
			birthDate: new Date(), 
			reports: [
				new Report("report1id", ",,,", 1),
				new Report("report2id", ",,,", 0),
				new Report("report3id", ",,,", 1),
				new Report("report4id", ",,,", 1)
			], 
			id: "test1_id", 
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		buyStocksUseCase = new BuyStocksUseCase(stockWriteOnlyRepository, tradeWriteOnlyRepository, userWriteOnlyRepository, userReadOnlyRepository);

		//Act
		tradeDto = await buyStocksUseCase.invoke({
			stock_id: "teststock1id",
			user_id: "testid1",
			stock_amount: 50,
		});

		//Assert
		expect(tradeDto.stock_id).toBe('teststock1id');
		expect(tradeDto.user_id).toBe('testid1');
		expect(tradeDto.stock_amount).toBe(50);
		expect(tradeDto.time_of_trade).toBe(newDate);
		expect(tradeDto.stock_value).toBe(956.9);
	})

	it("Sell stocks use case", async () => {
		//Arrange
		let sellStocksUseCase: ISellStocksUseCase;
		let tradeDto: ITradeDto;

		stockWriteOnlyRepository = mock<IStockWriteOnlyRepository>();
		tradeWriteOnlyRepository = mock<ITradeWriteOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();

		mock(stockWriteOnlyRepository).edit.mockResolvedValue([{
			id: "teststock1id",
			symbol: "teststock1symbol",
			name: "teststock1name",
			value: 956.9,
			volume: 6000,
			open: 898.5,
			close: 967.2
		}])

		let newDate = new Date();

		mock(tradeWriteOnlyRepository).create.mockResolvedValue({
			user_id: "testid1",
			stock_id: "teststock1id",
			stock_amount: 50,
			stock_value: 956.9,
			time_of_trade: newDate,
		})

		mock(userWriteOnlyRepository).edit.mockResolvedValue({
			username: "test1_username", 
			email: "test1email@test.com", 
			firstName: "test1fname", 
			lastName: "test1lname", 
			birthDate: new Date(), 
			reports: [
				new Report("report1id", ",,,", 1),
				new Report("report2id", ",,,", 0),
				new Report("report3id", ",,,", 1),
				new Report("report4id", ",,,", 1)
			], 
			id: "test1_id", 
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		sellStocksUseCase = new SellStocksUseCase(stockWriteOnlyRepository, tradeWriteOnlyRepository, userWriteOnlyRepository);
		
		//Act
		tradeDto = await sellStocksUseCase.invoke({
			stock_id: "testid1",
			user_id: "testid1",
			stock_amount: 50
		});

		//Assert
		expect(tradeDto.stock_id).toBe('teststock1id');
		expect(tradeDto.user_id).toBe('testid1');
		expect(tradeDto.stock_amount).toBe(50);
		expect(tradeDto.time_of_trade).toBe(newDate);
		expect(tradeDto.stock_value).toBe(956.9);
	})
})