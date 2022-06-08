import 'reflect-metadata';

import BuyStocksUseCase from "../Trades/BuyStocksUseCase";

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
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import GetUserTransactionHistoryUseCase from '../Trades/GetUserTransactionHistoryUseCase';
import IGetUserTransactionHistoryUseCase from '../Trades/IGetUserTransactionHistoryUseCase';
import IGetUserTransactionsByStatusUseCase from '../Trades/IGetUserTransactionsByStatusUseCase';
import GetUserTransactionsByStatusUseCase from '../Trades/GetUserTransactionsByStatusUseCase';
import IStockTradesForUserUseCase from '../Trades/IStockTradesForUserUseCase';
import StockTradesForUserUseCase from '../Trades/StockTradesForUseUseCase';
import GetUserPortfolioUseCase from '../Trades/GetUserPortfolioUseCase';
import IGetUserPortfolioUseCase from '../Trades/IGetUserPortfolioUseCase';

let tradeWriteOnlyRepository: ITradeWriteOnlyRepository;
let tradeReadOnlyRepository: ITradeReadOnlyRepository;
let stockWriteOnlyRepository: IStockWriteOnlyRepository;
let stockReadOnlyRepository: IStockReadOnlyRepository;
let userWriteOnlyRepository: IUserWriteOnlyRepository;
let userReadOnlyRepository: IUserReadOnlyRepository;

describe("Trade Tests", () => {
	beforeAll(() => {
		jest.clearAllMocks();
	})
	it("Buy stocks use case", async () => {
		//Arrange
		let buyStocksUseCase: IBuyStocksUseCase;
		let tradeDto: ITradeDto;

		stockWriteOnlyRepository = mock<IStockWriteOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		tradeWriteOnlyRepository = mock<ITradeWriteOnlyRepository>();
		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();

		tradeDto = {
			stock_id: "teststock1id",
			user_id: "testid1",
			stock_amount: 50,
		};

		mock(stockWriteOnlyRepository).edit.mockResolvedValue([{
			id: "teststock1id",
			symbol: "teststock1symbol",
			name: "teststock1name",
			value: 956.9,
			volume: 6000,
			open: 898.5,
			close: 967.2
		}])

		mock(stockReadOnlyRepository).fetch
			.mockResolvedValueOnce([{
				id: "teststock1id",
				symbol: "teststock1symbol",
				name: "teststock1name",
				value: 956.9,
				volume: 6000,
				open: 898.5,
				close: 967.2
			}])
			.mockResolvedValueOnce([{
				id: "teststock2id",
				symbol: "teststock2symbol",
				name: "teststock2name",
				value: 900,
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

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([{
			user_id: "testid1",
			stock_id: "teststock1id",
			stock_amount: 50,
			stock_value: 956.9,
			time_of_trade: newDate,
		}])

		mock(userWriteOnlyRepository).edit.mockResolvedValue({
			username: "test1_username",
			email: "test1email@test.com",
			firstName: "test1fname",
			lastName: "test1lname",
			birthDate: new Date(),
			reports: [
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() },
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() },
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() },
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() }
			],
			id: "test1_id",
			credit: 50000,
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			username: "test1_username",
			email: "test1email@test.com",
			firstName: "test1fname",
			lastName: "test1lname",
			birthDate: new Date(),
			reports: [
				{ id: "report1id", report_data: ",,,", report_type: "XML", report_date: new Date() },
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() },
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() },
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() }
			],
			id: "test1_id",
			credit: 50000,
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		buyStocksUseCase = new BuyStocksUseCase(stockWriteOnlyRepository,
			stockReadOnlyRepository,
			tradeWriteOnlyRepository,
			tradeReadOnlyRepository,
			userWriteOnlyRepository,
			userReadOnlyRepository);

		//Act
		tradeDto = await buyStocksUseCase.invoke(tradeDto);

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

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
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
				{ id: "report1id", report_data: ",,,", report_type: "XML", report_date: new Date() },
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() },
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() },
				{ id: "report1id", report_data: ",,,", report_type: "CSV", report_date: new Date() }
			],
			id: "test1_id",
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		sellStocksUseCase = new SellStocksUseCase(stockWriteOnlyRepository, stockReadOnlyRepository, tradeWriteOnlyRepository, tradeReadOnlyRepository, userWriteOnlyRepository, userReadOnlyRepository);

		//Act
		tradeDto = await sellStocksUseCase.invoke({
			stock_id: "testid1",
			user_id: "testid1",
			stock_amount: 50
		});

		//Assert
		expect(tradeDto).toStrictEqual(expect.objectContaining({
			"stock_amount": 50,
			"stock_id": "testid1",
			"stock_value": 956.9,
			"trade_type": "Sell",
			"user_id": "testid1",
		}));
	})

	it("Get user transactions use case", async () => {
		//Arrange
		let getUserTransactionHistory: IGetUserTransactionHistoryUseCase;
		let tradeDto: ITradeDto[];

		// Search through trades for every trade that had user id in

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();

		let newDate = new Date();

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
			id: "teststock1id",
			symbol: "teststock1symbol",
			name: "teststock1name",
			value: 956.9,
			volume: 6000,
			open: 898.5,
			close: 967.2
		}])

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				user_id: "testid1",
				stock_id: "teststock1id",
				stock_amount: 50,
				stock_value: 345.6,
				time_of_trade: newDate,
			},
			{
				user_id: "testid1",
				stock_id: "teststock12id",
				stock_amount: 6,
				stock_value: 87,
				time_of_trade: newDate,
			},
			{
				user_id: "testid1",
				stock_id: "teststock14id",
				stock_amount: 4,
				stock_value: 67,
				time_of_trade: newDate,
			}
		])

		getUserTransactionHistory = new GetUserTransactionHistoryUseCase(tradeReadOnlyRepository, stockReadOnlyRepository);

		//Act
		tradeDto = await getUserTransactionHistory.invoke({
			user_id: "testid1",
		});

		//Assert
		expect(tradeDto).toStrictEqual(expect.objectContaining([{
			"current_value": 956.9,
			"stock_amount": 50,
			"stock_id": "teststock1id",
			"stock_name": "teststock1name",
			"stock_value": 345.6,
			"symbol": "teststock1symbol",
			"time_of_trade": expect.any(Date),
			"user_id": "testid1"
		}, {
			"current_value": 956.9,
			"stock_amount": 6,
			"stock_id": "teststock12id",
			"stock_name": "teststock1name",
			"stock_value": 87,
			"symbol": "teststock1symbol",
			"time_of_trade": expect.any(Date),
			"user_id": "testid1"
		}, {
			"current_value": 956.9,
			"stock_amount": 4,
			"stock_id": "teststock14id",
			"stock_name": "teststock1name",
			"stock_value": 67,
			"symbol": "teststock1symbol",
			"time_of_trade": expect.any(Date),
			"user_id": "testid1"
		}]));
	})

	it("Get user transactions by status use case", async () => {
		//Arrange
		let getUserTransactionsByStatusUseCase: IGetUserTransactionsByStatusUseCase;
		let tradeDto: ITradeDto[];

		// Search through trades for every trade that had user id in

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();

		let newDate = new Date();

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
			id: "teststock1id",
			symbol: "teststock1symbol",
			name: "teststock1name",
			value: 956.9,
			volume: 6000,
			open: 898.5,
			close: 967.2
		}])

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				user_id: "testid1",
				stock_id: "teststock1id",
				stock_amount: 50,
				stock_value: 345.6,
				time_of_trade: newDate,
			},
			{
				user_id: "testid1",
				stock_id: "teststock12id",
				stock_amount: 6,
				stock_value: 87,
				time_of_trade: newDate,
			},
			{
				user_id: "testid1",
				stock_id: "teststock14id",
				stock_amount: 4,
				stock_value: 67,
				time_of_trade: newDate,
			}
		])

		getUserTransactionsByStatusUseCase = new GetUserTransactionsByStatusUseCase(tradeReadOnlyRepository);

		//Act
		tradeDto = await getUserTransactionsByStatusUseCase.invoke("Pending");

		//Assert
		expect(tradeDto).toStrictEqual(expect.objectContaining([{
			"stock_amount": 50,
			"stock_id": "teststock1id",
			"stock_value": 345.6,
			"time_of_trade": expect.any(Date),
			"user_id": "testid1"
		}, {
			"stock_amount": 6,
			"stock_id": "teststock12id",
			"stock_value": 87,
			"time_of_trade": expect.any(Date),
			"user_id": "testid1"
		}, {
			"stock_amount": 4,
			"stock_id": "teststock14id",
			"stock_value": 67,
			"time_of_trade": expect.any(Date),
			"user_id": "testid1"
		}]));
	})

	it("Get stocks trades by user use case", async () => {
		//Arrange
		let getUserTransactionsByStatusUseCase: IStockTradesForUserUseCase;
		let tradeDto: ITradeDto[];

		// Search through trades for every trade that had user id in

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();

		let newDate = new Date();

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				user_id: "testuserid",
				stock_id: "teststockid",
				stock_amount: 50,
				stock_value: 345.6,
				time_of_trade: newDate,
			},
			{
				user_id: "testuserid",
				stock_id: "teststockid",
				stock_amount: 6,
				stock_value: 87,
				time_of_trade: newDate,
			},
			{
				user_id: "testuserid",
				stock_id: "teststockid",
				stock_amount: 4,
				stock_value: 67,
				time_of_trade: newDate,
			}
		])

		getUserTransactionsByStatusUseCase = new StockTradesForUserUseCase(tradeReadOnlyRepository);

		//Act
		tradeDto = await getUserTransactionsByStatusUseCase.invoke({
			user_id: "testuserid",
			stock_id: "teststockid",
		});

		//Assert
		expect(tradeDto).toStrictEqual(expect.objectContaining([{
			"stock_amount": 50,
			"stock_id": "teststockid",
			"stock_value": 345.6,
			"time_of_trade": expect.any(Date),
			"user_id": "testuserid"
		}, {
			"stock_amount": 6,
			"stock_id": "teststockid",
			"stock_value": 87,
			"time_of_trade": expect.any(Date),
			"user_id": "testuserid"
		}, {
			"stock_amount": 4,
			"stock_id": "teststockid",
			"stock_value": 67,
			"time_of_trade": expect.any(Date),
			"user_id": "testuserid"
		}]));
	})

	it("Get user portfolio use case", async () => {
		//Arrange
		let getUserTransactionsByStatusUseCase: IGetUserPortfolioUseCase;
		let tradeDto: { [key: string]: number };

		// Search through trades for every trade that had user id in

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();

		let newDate = new Date();

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "teststockid",
				name: "Test",
				symbol: "TST",
				value: 50,
			}
		])

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				user_id: "testuserid",
				stock_id: "teststockid",
				trade_status: "Approved",
				trade_type: "Buy",
				stock_amount: 50,
				stock_value: 345.6,
				time_of_trade: newDate,
			},
			{
				user_id: "testuserid",
				stock_id: "teststockid",
				trade_status: "Approved",
				trade_type: "Sell",
				stock_amount: 6,
				stock_value: 87,
				time_of_trade: newDate,
			},
			{
				user_id: "testuserid",
				stock_id: "teststockid",
				trade_status: "Approved",
				trade_type: "Buy",
				stock_amount: 4,
				stock_value: 67,
				time_of_trade: newDate,
			},
			{
				user_id: "testuserid",
				stock_id: "teststockid",
				trade_status: "Pending",
				trade_type: "Buy",
				stock_amount: 4,
				stock_value: 67,
				time_of_trade: newDate,
			},
			{
				user_id: "testuserid",
				stock_id: "teststockid",
				trade_status: "Rejected",
				trade_type: "Buy",
				stock_amount: 4,
				stock_value: 67,
				time_of_trade: newDate,
			}
		])

		getUserTransactionsByStatusUseCase = new GetUserPortfolioUseCase(stockReadOnlyRepository, tradeReadOnlyRepository);

		//Act
		tradeDto = await getUserTransactionsByStatusUseCase.invoke({
			id: "test"
		});

		//Assert
		expect(tradeDto).toStrictEqual(expect.objectContaining({
			"invested": 15474.4,
			"portfolio": 50,
			"return": -15424.4,
		}));
	})
})