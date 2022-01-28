import { mock } from "jest-mock-extended";
import "jest";
import bcrypt from "bcryptjs";

import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import User from "../entities/User";``
import IUserDto from "../data_tranfer_objects/IUserDto";
import IUserSignInUseCase from "../IUserSignInUseCase";
import UserSignInUseCase from "../UserSignInUseCase";

let userReadOnlyRepository: IUserReadOnlyRepository = mock<IUserReadOnlyRepository>();;

describe('User Use Cases', () => {
	beforeAll(async () => {
		mock(userReadOnlyRepository).fetch.mockResolvedValue(new User('1', 'test1username', await bcrypt.hash('test1password', 6), 'test1email@test.com', 'test1fname', 'test1lname', new Date(), []));
	});
	
	it('User sign in use case', async () => {
		// Arrange
		let userSignInUseCase: IUserSignInUseCase;
		let userDto: IUserDto;


		userSignInUseCase = new UserSignInUseCase(userReadOnlyRepository);

		// Act
		userDto = await userSignInUseCase.invoke(new User('1', '', 'test1password', '', '', '', new Date(), []));

		// Assert
		expect(userDto.username).toBeDefined();
	});
});