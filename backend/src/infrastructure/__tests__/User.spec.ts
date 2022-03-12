import 'reflect-metadata';
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import FakeUserWriteOnlyRepository from '../FakeUserWriteOnlyRepository';
describe('User Repository Tests', () => {
	it('FakeUserWriteOnlyRepository', async () => {
		let newUserDto: IUserDto = {
			username: "test3user",
			email: "test3email@test.com",
			firstName: "test3fname",
			lastName: "test3lname",
			password: "test3password",
		};

		let userWriteOnlyRepository: IUserWriteOnlyRepository = new FakeUserWriteOnlyRepository()

		let returnValue = await userWriteOnlyRepository.create(newUserDto);

		expect(returnValue.email).toBe("test3email@test.com");
	})
})