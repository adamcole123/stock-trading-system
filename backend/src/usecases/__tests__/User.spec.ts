import 'reflect-metadata';
import { mock } from "jest-mock-extended";
import "jest";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import User from "../entities/User";
import IUserWriteOnlyRepository from "../../application/repositories/IUserWriteOnlyRepository";
import EditUserDetailsUseCase from "../Users/EditUserDetailsUseCase";
import FakeUserReadOnlyRepository from '../../infrastructure/FakeUserReadOnlyRepository';
import FakeUserWriteOnlyRepository from '../../infrastructure/FakeUserWriteOnlyRepository';
import IEditUserDetailsUseCase from "../Users/IEditUserDetailsUseCase";
import IUserRegisterUseCase from "../Users/IUserRegisterUseCase";
import IUserSignInUseCase from "../Users/IUserSignInUseCase";
import UserRegisterUseCase from "../Users/UserRegisterUseCase";
import UserSignInUseCase from "../Users/UserSignInUseCase";
import IUserDto from '../data_tranfer_objects/IUserDto';
import Report from "../entities/Report";
import ValidateUserTokenUseCase from '../Users/ValidateUserTokenUseCase';
import { JwtPayload } from 'jsonwebtoken';
import CardDetails from '../entities/CardDetails';
import Encrypter from '../../infrastructure/Encrypter';


describe('User Use Cases', () => {
	let userReadOnlyRepository: IUserReadOnlyRepository = mock<IUserReadOnlyRepository>();
	let userWriteOnlyRepository: IUserWriteOnlyRepository = mock<IUserWriteOnlyRepository>();

	dotenv.config();

	beforeAll(async () => {
		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			username: "test1username",
			email: "test1email",
			firstName: "test1firstname",
			lastName: "test1lastname",
			birthDate: new Date('0'),
			reports: [],
			id: "test1id",
			password: await bcrypt.hashSync('test1password', bcrypt.genSaltSync(10)),
			credit: 50000,
			role: "User",
			isDeleted: false,
			cardDetails: [],
			activationDate: new Date('0')
		});
		mock(userWriteOnlyRepository).create.mockResolvedValue({
			username: "test1username",
			email: "test1email",
			firstName: "test1firstname",
			lastName: "test1lastname",
			birthDate: new Date('0'),
			reports: [],
			id: "test1id",
			password: await bcrypt.hashSync('test1password', bcrypt.genSaltSync(10)),
			credit: 50000,
			role: "User",
			isDeleted: false,
			cardDetails: [],
			activationDate: new Date('0')
		});
	});

	it('User sign in use case', async () => {
		// Arrange
		let userSignInUseCase: IUserSignInUseCase;
		let userDto: IUserDto;

		userSignInUseCase = new UserSignInUseCase(userReadOnlyRepository);

		// Act
		userDto = await userSignInUseCase.invoke({
			id: '1',
			username: 'test1username',
			password: 'test1password',
			email: '',
			firstName: '',
			lastName: '',
			reports: []
		});

		// Assert
		expect(userDto).toStrictEqual(expect.objectContaining({
			"activationDate": userDto.activationDate,
			"birthDate": userDto.birthDate,
			"cardDetails": [],
			"credit": 50000,
			"email": "test1email",
			"firstName": "test1firstname",
			"id": "test1id",
			"isDeleted": false,
			"lastName": "test1lastname",
			"password": "",
			"reports": [],
			"role": "User",
			"username": "test1username",
		}));
	});

	it('User register use case', async () => {
		//Arrange
		let userRegisterUseCase: IUserRegisterUseCase;
		let userDto: IUserDto;

		userRegisterUseCase = new UserRegisterUseCase(userWriteOnlyRepository);

		//Act
		userDto = await userRegisterUseCase.invoke({ id: '', username: 'test2username', password: 'test2password', email: 'test@test.com', firstName: 'test2fname', lastName: 'test2lname', birthDate: new Date(), reports: [] })

		//Assert
		expect(userDto).toStrictEqual({
			"activationDate": userDto.activationDate,
			"birthDate": userDto.birthDate,
			"cardDetails": [],
			"credit": 50000,
			"email": "test1email",
			"firstName": "test1firstname",
			"id": "test1id",
			"isDeleted": false,
			"lastName": "test1lastname",
			"password": "",
			"reports": [],
			"role": "User",
			"username": "test1username",
		});
	});

	// it('User has £50,000 after register', async () => {
	// 	//Arrange
	// 	let userRegisterUseCase: IUserRegisterUseCase;
	// 	let userDto: IUserDto;

	// 	userRegisterUseCase = new UserRegisterUseCase(userWriteOnlyRepository);

	// 	//Act
	// 	userDto = await userRegisterUseCase.invoke({
	// 		id: 'x', 
	// 		username: 'testxusername',
	// 		password: 'testxpassword', 
	// 		email: 'testx@test.com', 
	// 		firstName: 'testxfname', 
	// 		lastName: 'testxlname', 
	// 		birthDate: new Date(), 
	// 		reports: []
	// 	})

	// 	let newUser = await newUserReadOnlyRepository.fetch({username: "testxusername"});
	// 	//Assert
	// 	expect(newUser.credit).toBe(50000)
	// })

	it('Edit user details use case', async () => {
		//Arrange
		let userDto: IUserDto;

		mock(userWriteOnlyRepository).edit.mockResolvedValue({
			username: 'test1changedusername',
			email: 'test1changedemail@test.com',
			firstName: 'test1changedfname',
			lastName: 'test1changedlname'
		})

		let editUserDetailsUseCase: IEditUserDetailsUseCase = new EditUserDetailsUseCase(userWriteOnlyRepository);

		//Act
		userDto = await editUserDetailsUseCase.invoke('test3_username', { username: 'test1changedusername', email: 'test1changedemail@test.com', firstName: 'test1changedfname', lastName: 'test1changedlname' });

		//Assert
		expect(userDto.username).toBe(`test1changedusername`);
		expect(userDto.email).toBe('test1changedemail@test.com');
		expect(userDto.firstName).toBe('test1changedfname');
		expect(userDto.lastName).toBe('test1changedlname');
	});

	it('Validate user token use case', async () => {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;

		let userData: IUserDto = {
			username: "test1username",
			email: "test1email",
			firstName: "test1firstname",
			lastName: "test1lastname",
			birthDate: new Date('0'),
			reports: [],
			id: "test1id",
			password: await bcrypt.hashSync('test1password', bcrypt.genSaltSync(10)),
			credit: 50000,
			role: "User",
			isDeleted: false,
			cardDetails: [],
			activationDate: new Date('0')
		};

		let token = jwt.sign(userData, jwtSecretKey!);

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			username: "test1username",
			email: "test1email",
			firstName: "test1firstname",
			lastName: "test1lastname",
			birthDate: new Date('0'),
			reports: [],
			id: "test1id",
			password: await bcrypt.hashSync('test1password', bcrypt.genSaltSync(10)),
			credit: 50000,
			role: "User",
			isDeleted: false,
			cardDetails: [],
			activationDate: new Date('0')
		})

		let validateUserTokenUseCase = new ValidateUserTokenUseCase(userReadOnlyRepository, new Encrypter());

		let validated: string | JwtPayload = await validateUserTokenUseCase.invoke(token);

		expect(validated).toStrictEqual(expect.objectContaining({
			"activationDate": expect.any(Date),
			"birthDate": expect.any(Date),
			"cardDetails": [],
			"credit": 50000,
			"email": "test1email",
			"firstName": "test1firstname",
			"id": "test1id",
			"isDeleted": false,
			"lastName": "test1lastname",
			"password": "",
			"reports": [],
			"role": "User",
			"username": "test1username",
		}));
	})
});