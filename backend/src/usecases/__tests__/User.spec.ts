import { mock } from "jest-mock-extended";
import "jest";
import bcrypt from "bcryptjs";

import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import User from "../entities/User";``
import IUserDto from "../data_tranfer_objects/IUserDto";
import IUserSignInUseCase from "../IUserSignInUseCase";
import UserSignInUseCase from "../UserSignInUseCase";
import IUserWriteOnlyRepository from "../../application/repositories/IUserWriteOnlyRepository";
import IUserRegisterUseCase from "../IUserRegisterUseCase";
import UserRegisterUseCase from "../UserRegisterUseCase";


describe('User Use Cases', () => {
	let userReadOnlyRepository: IUserReadOnlyRepository = mock<IUserReadOnlyRepository>();
	let userWriteOnlyRepository: IUserWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
	
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
		userDto = await userSignInUseCase.invoke({id: '1', username: '', password: 'test1password', email: '', firstName: '', lastName: '', reports: []});

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
});