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
			let user = await User.findOne({username: userDto.username});
			if(!user){
				reject("No user with that username exists");
			}

			let returnObj = user;

			returnObj.id = returnObj._id;
			
			resolve(user);
		})
	}
	
}