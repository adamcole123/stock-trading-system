import { mock } from "jest-mock-extended";
import "jest";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import User from "../entities/User";
import IUserWriteOnlyRepository from "../../application/repositories/IUserWriteOnlyRepository";
import EditUserDetailsUseCase from "../Users/EditUserDetailsUseCase";
import FakeUserReadOnlyRepository from "../../application/repositories/FakeUserReadOnlyRepository";
import FakeUserWriteOnlyRepository from '../../application/repositories/FakeUserWriteOnlyRepository';
import IEditUserDetailsUseCase from "../Users/IEditUserDetailsUseCase";
import IUserRegisterUseCase from "../Users/IUserRegisterUseCase";
import IUserSignInUseCase from "../Users/IUserSignInUseCase";
import UserRegisterUseCase from "../Users/UserRegisterUseCase";
import UserSignInUseCase from "../Users/UserSignInUseCase";
import IUserDto from "../data_tranfer_objects/IUserDto";
import ReportType from '../entities/ReportType';
import Report from "../entities/Report";
import ValidateUserTokenUseCase from '../Users/ValidateUserTokenUseCase';
import { ensureFullyBound } from "inversify/lib/utils/binding_utils";
import { JwtPayload } from 'jsonwebtoken';


describe('User Use Cases', () => {
	let userReadOnlyRepository: IUserReadOnlyRepository = mock<IUserReadOnlyRepository>();
	let userWriteOnlyRepository: IUserWriteOnlyRepository = mock<IUserWriteOnlyRepository>();

	dotenv.config();
	
	beforeAll(async () => {
		mock(userReadOnlyRepository).fetch.mockResolvedValue(new User('test1username', 'test1email@test.com', 'test1fname', 'test1lname', new Date(), [], '1', await bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))));
		mock(userWriteOnlyRepository).create.mockResolvedValue({ id: '', username: 'test2username', password: '', email: 'test2email@test.com', firstName: 'test2fname', lastName: 'test2lname', birthDate: new Date(), reports: [] });
	});
	
	it('User sign in use case', async () => {
		// Arrange
		let userSignInUseCase: IUserSignInUseCase;
		let userDto: IUserDto;


		userSignInUseCase = new UserSignInUseCase(userReadOnlyRepository);

		// Act
		userDto = await userSignInUseCase.invoke({id: '1', username: 'test1username', password: 'test1password', email: '', firstName: '', lastName: '', reports: []});

		// Assert
		expect(userDto.username).toBe('test1username');
		expect(userDto.password).toBe('');
		expect(userDto.firstName).toBe('test1fname');
		expect(userDto.lastName).toBe('test1lname');
		expect(userDto.email).toBe('test1email@test.com');
	});

	it('User register use case', async () => {
		//Arrange
		let userRegisterUseCase: IUserRegisterUseCase;
		let userDto: IUserDto;

		userRegisterUseCase = new UserRegisterUseCase(userWriteOnlyRepository);
		
		//Act
		userDto = await userRegisterUseCase.invoke({id: '', username: 'test2username', password: 'test2password', email: 'test@test.com', firstName: 'test2fname', lastName: 'test2lname', birthDate: new Date(), reports: []})

		//Assert
		expect(userDto.password).toBe('')
		expect(userDto.id).toBe('')
		expect(userDto.username).toBe('test2username')
		expect(userDto.email).toBe('test2email@test.com')
		expect(userDto.firstName).toBe('test2fname')
		expect(userDto.lastName).toBe('test2lname')

	});

	it('Edit user details use case', async () => {
		//Arrange
		userWriteOnlyRepository = new FakeUserWriteOnlyRepository();
		userReadOnlyRepository = new FakeUserReadOnlyRepository();
		let userDto: IUserDto;
		let foundUser: IUserDto;
		
		let editUserDetailsUseCase: IEditUserDetailsUseCase = new EditUserDetailsUseCase(userWriteOnlyRepository);
		
		//Act
		userDto = await editUserDetailsUseCase.invoke('test1username', {username: 'test1changedusername', email: 'test1changedemail@test.com', firstName: 'test1changedfname', lastName: 'test1changedlname'});
		foundUser = await userReadOnlyRepository.fetch({ id: '', username: 'test1changedusername', email: '', firstName: '', lastName: '' });

		//Assert
		expect(foundUser.username).toBe(`test1changedusername`);
		expect(foundUser.email).toBe('test1changedemail@test.com');
		expect(foundUser.firstName).toBe('test1changedfname');
		expect(foundUser.lastName).toBe('test1changedlname');
	});

	it('Validate user token use case', async () => {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;

		let userData: IUserDto = {
			id: 'testid',
			firstName: 'firstName',
			lastName: 'lastName',
			username: 'username',
			email: 'test@test.com',
			password: 'testpassword',
			birthDate: new Date('0'),
			reports: [
				new Report('report_id', 'report data', 0)
			]
		};

		let token = jwt.sign(userData, jwtSecretKey!);

		let validateUserTokenUseCase = new ValidateUserTokenUseCase();

		let validated: string | JwtPayload = await validateUserTokenUseCase.invoke(token);

		let expectedResult: Object = {
			"birthDate": "2000-01-01T00:00:00.000Z", 
			"email": "test@test.com", 
			"firstName": "firstName",
			"id": "testid",
			"lastName": "lastName", 
			"password": "testpassword", 
			"reports": [
				{
					"id": "report_id", 
					"report_data": "report data", 
					"report_type": 0
				}
			], 
			"username": "username"
		};
		expect(validated).toEqual(expect.objectContaining({
			birthDate: "2000-01-01T00:00:00.000Z",
			email: "test@test.com", 
			firstName: "firstName",
			id: "testid",
			lastName: "lastName", 
			password: "testpassword", 
			reports: [
				{
					id: "report_id", 
					report_data: "report data", 
					report_type: 0
				}
			],
			username: "username"
		  }))
	})
});