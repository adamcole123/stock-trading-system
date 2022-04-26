import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import User from './User';
import { injectable } from 'inversify';

@injectable()
export default class UserReadRepository implements IUserReadOnlyRepository {
	async fetchAll(): Promise<IUserDto[]> {
		let users = await User.find({});
		return users;
	}

	fetch(userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			let user: IUserDto;
			try {
				if(userDto.id)
					user = await <IUserDto>User.findById(userDto.id);
				if(userDto.username)
					user = await <IUserDto>User.findOne({username: userDto.username});
			} catch (err) {
				reject("No user with that username or id exists");
			}
			resolve(user!);
		})
	}
	
}