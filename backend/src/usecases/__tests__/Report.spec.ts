import { mock } from "vitest-mock-extended";
import { describe, expect, it } from "vitest";
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';
import bcrypt from 'bcryptjs';
import IGenerateReportUseCase from '../Reports/IGenerateReportUseCase';
import GenerateReportUseCase from '../Reports/GenerateReportUseCase';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IReportDto from '../data_tranfer_objects/IReportDto';
import ITradeReadOnlyRepository from 'src/application/repositories/ITradeReadOnlyRepository';

let stockReadOnlyRepository: IStockReadOnlyRepository;
let userWriteOnlyRepository: IUserWriteOnlyRepository;
let userReadOnlyRepository: IUserReadOnlyRepository;
let tradeReadOnlyRepository: ITradeReadOnlyRepository;

describe('Report tests', () => {
	it('Generate report use case: complete list of stock value of each company in ascending order', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();

		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();

		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		
		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			username: "test1_username", 
			email: "test1email@test.com", 
			firstName: "test1fname", 
			lastName: "test1lname", 
			birthDate: new Date(), 
			reports: [
				{
					id: "report1id", 
					report_data: ",,,",
					report_type: "CSV", 
					report_date: new Date()
				},
				{
					id: "report2id", 
					report_data: ",,,",
					report_type: "XML", 
					report_date: new Date()
				},
				{
					id: "report3id", 
					report_data: ",,,",
					report_type: "CSV", 
					report_date: new Date()
				},
			], 
			id: "test1_id", 
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			username: "test1_username", 
			email: "test1email@test.com", 
			firstName: "test1fname", 
			lastName: "test1lname", 
			birthDate: new Date(), 
			reports: [
				{
					id: "report1id", 
					report_data: ",,,",
					report_type: "CSV", 
					report_date: new Date()
				},
				{
					id: "report2id", 
					report_data: ",,,",
					report_type: "XML", 
					report_date: new Date()
				},
				{
					id: "report3id", 
					report_data: ",,,",
					report_type: "CSV", 
					report_date: new Date()
				},
				{
					id: "report4id", 
					report_data: ",,,",
					report_type: "XML", 
					report_date: new Date()
				},
			], 
			id: "test1_id", 
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
			id: "test1"
		},
		{
			id: "test2"
		},
		{
			id: "test3"
		},
		{
			id: "test4"
		}])

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.completeStockValues("test1_id", true, "CSV");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({
			"id": "report1id",
			"report_data": ",,,",
			"report_type": "CSV"
		}));
		expect(userDto.reports![1]).toStrictEqual(expect.objectContaining({
			"id": "report2id",
			"report_data": ",,,",
			"report_type": "XML"
		}));
		expect(userDto.reports![2]).toStrictEqual(expect.objectContaining({
			"id": "report3id",
			"report_data": ",,,",
			"report_type": "CSV"
		}));
		expect(userDto.reports![3]).toStrictEqual(expect.objectContaining({
			"id": "report4id",
			"report_data": ",,,",
			"report_type": "XML"
		}));
	})
	it('Generate report use case: complete list of stock value of each company in descending order', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();

		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();

		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		
		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			username: "test1_username", 
			email: "test1email@test.com", 
			firstName: "test1fname", 
			lastName: "test1lname", 
			birthDate: new Date(), 
			reports: [
				{
					id: "report1id", 
					report_data: ",,,",
					report_type: "CSV", 
					report_date: new Date()
				},
				{
					id: "report2id", 
					report_data: ",,,",
					report_type: "XML", 
					report_date: new Date()
				},
				{
					id: "report3id", 
					report_data: ",,,",
					report_type: "CSV", 
					report_date: new Date()
				},
			], 
			id: "test1_id", 
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			username: "test1_username", 
			email: "test1email@test.com", 
			firstName: "test1fname", 
			lastName: "test1lname", 
			birthDate: new Date(), 
			reports: [
				{
					id: "report1id", 
					report_data: ",,,",
					report_type: "CSV", 
					report_date: new Date()
				},
				{
					id: "report2id", 
					report_data: ",,,",
					report_type: "XML", 
					report_date: new Date()
				},
				{
					id: "report3id", 
					report_data: ",,,",
					report_type: "CSV", 
					report_date: new Date()
				},
				{
					id: "report4id", 
					report_data: ",,,",
					report_type: "XML", 
					report_date: new Date()
				},
			], 
			id: "test1_id", 
			password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
		})

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
			id: "test1"
		},
		{
			id: "test2"
		},
		{
			id: "test3"
		},
		{
			id: "test4"
		}])

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.completeStockValues("test1_id", false, "CSV");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({
			"id": "report1id",
			"report_data": ",,,",
			"report_type": "CSV"
		}));
		expect(userDto.reports![1]).toStrictEqual(expect.objectContaining({
			"id": "report2id",
			"report_data": ",,,",
			"report_type": "XML"
		}));
		expect(userDto.reports![2]).toStrictEqual(expect.objectContaining({
			"id": "report3id",
			"report_data": ",,,",
			"report_type": "CSV"
		}));
		expect(userDto.reports![3]).toStrictEqual(expect.objectContaining({
			"id": "report4id",
			"report_data": ",,,",
			"report_type": "XML"
		}));
	})

	it('Generate report use case: users held shares ordered by company name ascending, CSV', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
		
		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506517",
				stock_amount: 43634,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 64536,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Rejected",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 16456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Buy"
			},
			{			
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506523",
				stock_amount: 256,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 5555,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Sell"
			}
		])

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				symbol: "Test",
				value: 4343,
				volume: 34234,
				open: 12312,
				close: 1414,
				name: "test",
				gains: 3252
			}
		])

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [],
			credit: 50000,
			cardDetails: []
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [
				{
					id: "testid", 
					report_data: ",,,", 
					report_type: "CSV", 
					report_date: new Date()
				}
			],
			credit: 50000,
			cardDetails: []
		})

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.usersHeldShares("6266de71b90b594dab9037f3", true, "CSV");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({"id": "testid", "report_data": ",,,", "report_type": "CSV"}));
	})

	it('Generate report use case: users held shares ordered by company name descending, CSV', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
		
		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506517",
				stock_amount: 43634,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 64536,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Rejected",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 16456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Buy"
			},
			{			
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506523",
				stock_amount: 256,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 5555,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Sell"
			}
		])

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				symbol: "Test",
				value: 4343,
				volume: 34234,
				open: 12312,
				close: 1414,
				name: "test",
				gains: 3252
			}
		])

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [],
			credit: 50000,
			cardDetails: []
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [
				{
					id: "testid", 
					report_data: ",,,", 
					report_type: "CSV", 
					report_date: new Date()
				}
			],
			credit: 50000,
			cardDetails: []
		})

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.usersHeldShares("6266de71b90b594dab9037f3", false, "CSV");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({"id": "testid", "report_data": ",,,", "report_type": "CSV"}));
	})

	it('Generate report use case: users held shares ordered by company name ascending, XML', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
		
		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506517",
				stock_amount: 43634,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 64536,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Rejected",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 16456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Buy"
			},
			{			
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506523",
				stock_amount: 256,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 5555,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Sell"
			}
		])

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				symbol: "Test",
				value: 4343,
				volume: 34234,
				open: 12312,
				close: 1414,
				name: "test",
				gains: 3252
			}
		])

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [],
			credit: 50000,
			cardDetails: []
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [
				{
					id: "testid", 
					report_data: ",,,", 
					report_type: "CSV", 
					report_date: new Date()
				}
			],
			credit: 50000,
			cardDetails: []
		})

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.usersHeldShares("6266de71b90b594dab9037f3", true, "XML");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({"id": "testid", "report_data": ",,,", "report_type": "CSV"}));
	})

	it('Generate report use case: users held shares ordered by company name descending, XML', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
		
		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506517",
				stock_amount: 43634,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 64536,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Rejected",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 16456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Buy"
			},
			{			
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506523",
				stock_amount: 256,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 5555,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Approved",
				trade_type: "Sell"
			}
		])

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				symbol: "Test",
				value: 4343,
				volume: 34234,
				open: 12312,
				close: 1414,
				name: "test",
				gains: 3252
			}
		])

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [],
			credit: 50000,
			cardDetails: []
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [
				{
					id: "testid", 
					report_data: ",,,", 
					report_type: "CSV", 
					report_date: new Date()
				}
			],
			credit: 50000,
			cardDetails: []
		})

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.usersHeldShares("6266de71b90b594dab9037f3", false, "XML");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({"id": "testid", "report_data": ",,,", "report_type": "CSV"}));
	})

	it('Generate report use case: stock details selected by user descending, XML', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
		
		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506517",
				stock_amount: 43634,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 64536,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 16456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Buy"
			},
			{			
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506523",
				stock_amount: 256,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 5555,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			}
		])

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				symbol: "Test",
				value: 4343,
				volume: 34234,
				open: 12312,
				close: 1414,
				name: "test",
				gains: 3252
			}
		])

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [],
			credit: 50000,
			cardDetails: []
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [
				{
					id: "testid", 
					report_data: ",,,", 
					report_type: "CSV", 
					report_date: new Date()
				}
			],
			credit: 50000,
			cardDetails: []
		})

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.selectedCompanyDetails("6266de71b90b594dab9037f3", false, ["teststock1", "teststock2", "teststock3"], "XML");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({"id": "testid", "report_data": ",,,", "report_type": "CSV"}));
	})

	it('Generate report use case: stock details selected by user ascending, XML', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
		
		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506517",
				stock_amount: 43634,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 64536,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 16456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Buy"
			},
			{			
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506523",
				stock_amount: 256,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 5555,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			}
		])

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				symbol: "Test",
				value: 4343,
				volume: 34234,
				open: 12312,
				close: 1414,
				name: "test",
				gains: 3252
			}
		])

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [],
			credit: 50000,
			cardDetails: []
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [
				{
					id: "testid", 
					report_data: ",,,", 
					report_type: "CSV", 
					report_date: new Date()
				}
			],
			credit: 50000,
			cardDetails: []
		})

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.selectedCompanyDetails("6266de71b90b594dab9037f3", false, ["test1", "test2", "test3"], "XML");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({"id": "testid", "report_data": ",,,", "report_type": "CSV"}));
	})

	it('Generate report use case: stock details selected by user ascending, CSV', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
		
		mock(tradeReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506517",
				stock_amount: 43634,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 64536,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506516",
				stock_amount: 16456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Buy"
			},
			{			
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab506523",
				stock_amount: 256,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 456,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Buy"
			},
			{
				id: "6269bde4396f1f2d94f6579f",
				user_id: "6266de71b90b594dab9037f3",
				stock_id: "62681cd6ca16f2a4ab5065123",
				stock_amount: 5555,
				stock_value: 167.12,
				time_of_trade: new Date(),
				trade_status: "Pending",
				trade_type: "Sell"
			}
		])

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				symbol: "Test",
				value: 4343,
				volume: 34234,
				open: 12312,
				close: 1414,
				name: "test",
				gains: 3252
			}
		])

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [],
			credit: 50000,
			cardDetails: []
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [
				{
					id: "testid", 
					report_data: ",,,", 
					report_type: "CSV", 
					report_date: new Date()
				}
			],
			credit: 50000,
			cardDetails: []
		})

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.selectedCompanyDetails("6266de71b90b594dab9037f3", true, ["test1", "test2", "test3", "test4"], "CSV");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({"id": "testid", "report_data": ",,,", "report_type": "CSV"}));
	})

	it('Generate report use case: stock details selected by user descending, CSV', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let userDto: IUserDto;

		tradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();
		stockReadOnlyRepository = mock<IStockReadOnlyRepository>();
		userReadOnlyRepository = mock<IUserReadOnlyRepository>();
		userWriteOnlyRepository = mock<IUserWriteOnlyRepository>();

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([
			{
				id: "6269bde4396f1f2d94f6579f",
				symbol: "Test",
				value: 4343,
				volume: 34234,
				open: 12312,
				close: 1414,
				name: "test",
				gains: 3252
			}
		])

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [],
			credit: 50000,
			cardDetails: []
		})

		mock(userWriteOnlyRepository).addReport.mockResolvedValue({
			id: "testid",
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfname",
			lastName: "testlname",
			birthDate: new Date(),
			reports: [
				{
					id: "testid", 
					report_data: ",,,", 
					report_type: "CSV", 
					report_date: new Date()
				}
			],
			credit: 50000,
			cardDetails: []
		})

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository, tradeReadOnlyRepository);

		//Act
		userDto = await generateReportUseCase.selectedCompanyDetails("6266de71b90b594dab9037f3", true, ["test1", "test2", "test3", "test4"], "CSV");

		//Assert
		expect(userDto.reports![0]).toStrictEqual(expect.objectContaining({"id": "testid", "report_data": ",,,", "report_type": "CSV"}));
	})
})