import { mock } from "jest-mock-extended";
import "jest";
import bcrypt from "bcryptjs";

import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import User from "../entities/User";``
import IUserDto from "../data_tranfer_objects/IUserDto";
import IUserSignInUseCase from "../IUserSignInUseCase";
import UserSignInUseCase from "../UserSignInUseCase";


describe('User Use Cases', () => {
	let userReadOnlyRepository: IUserReadOnlyRepository = mock<IUserReadOnlyRepository>();
	
	beforeAll(async () => {
		mock(userReadOnlyRepository).fetch.mockResolvedValue(new User('1', 'test1username', await bcrypt.hashSync('test1password', bcrypt.genSaltSync(10)), 'test1email@test.com', 'test1fname', 'test1lname', new Date(), []));
	});
	
	it('User sign in use case', async () => {
		// Arrange
		let userSignInUseCase: IUserSignInUseCase;
		let userDto: IUserDto;


		userSignInUseCase = new UserSignInUseCase(userReadOnlyRepository);

		// Act
		userDto = await userSignInUseCase.invoke(new User('1', '', 'test1password', '', '', '', new Date(), []));

		// Assert
		expect(userDto.username).toBe('test1username');
	});

	it('User register use case', () => {
		//Arrange

		//Act

		//Assert
	});
});