import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import IUserReadOnlyRepository from './IUserReadOnlyRepository';
import users from './FakeUserData';

export default class FakeUserReadOnlyRepository implements IUserReadOnlyRepository {

	constructor() {
	}

	fetchAll(): Promise<IUserDto[]> {
		throw new Error('Method not implemented.');
	}
	
	fetch(userDto: IUserDto): Promise<IUserDto> {
		return new Promise((resolve, reject) => {
			let foundUser = users.find(x => x.username == userDto.username);
			
			if(foundUser)
				resolve(foundUser);

			throw new Error('Could not find user');
		})
	}
}