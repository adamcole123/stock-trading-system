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
			let user: any;
			try {
				if(userDto.id)
					user = await User.findById(userDto.id);
				if(userDto.username)
					user = await User.findOne({username: userDto.username});
			} catch (err) {
				reject("No user with that username or id exists");
			}

			if(user){
				userDto = {
					id: user._id,
					username: user.username,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					birthDate: user.birthDate,
					reports: user.reports,
					credit: user.credit,
					role: user.role,
					isDeleted: user.isDeleted,
					cardDetails: user.cardDetails,
					password: user.password,
				}
			
				resolve(userDto!);
			}
			
			reject("Could not find user");
		})
	}
	
}