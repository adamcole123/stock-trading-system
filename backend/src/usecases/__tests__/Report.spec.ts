import { mock } from 'jest-mock-extended';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';
import Report from '../entities/Report';
import bcrypt from 'bcryptjs';
import IGenerateReportUseCase from '../Reports/IGenerateReportUseCase';
import GenerateReportUseCase from '../Reports/GenerateReportUseCase';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IReportDto from '../data_tranfer_objects/IReportDto';
import ReportType from '../entities/ReportType';

let stockReadOnlyRepository: IStockReadOnlyRepository;
let userWriteOnlyRepository: IUserWriteOnlyRepository;
let userReadOnlyRepository: IUserReadOnlyRepository;

describe('Report tests', () => {
	it('Generate report use case: complete list of stock value of each company in ascending order', async () => {
		//Arrange
		let generateReportUseCase: IGenerateReportUseCase;
		let reportDto: IReportDto;
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

		mock(userWriteOnlyRepository).edit.mockResolvedValue({
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

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository);

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
		let reportDto: IReportDto;
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

		mock(userWriteOnlyRepository).edit.mockResolvedValue({
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

		generateReportUseCase = new GenerateReportUseCase(stockReadOnlyRepository, userReadOnlyRepository, userWriteOnlyRepository);

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
})