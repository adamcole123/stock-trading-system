import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import User from './User';
import { injectable } from 'inversify';
import cardDetailsSchema from './CardDetailsSchema';
import { QueryWithHelpers } from 'mongoose';

@injectable()
export default class UserReadRepository implements IUserReadOnlyRepository {
	async fetchAll(): Promise<IUserDto[]> {
		let users: any = await User.find({});
		return users as IUserDto[];
	}

	fetch(userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			let user: any;
			try {
				if (userDto.id){
					user = await User.findById(userDto.id);
				} else if (userDto.username) {
					user = await User.findOne({ username: userDto.username });
				} else if (userDto.email){
					user = await User.findOne({ email: userDto.email });
				} else {
					return reject("No username, id, or email was provided");
				}
			} catch (err) {
				return reject("No user with that username, id, or email exists");
			}


			if (user! !== null) {
				let transformedUser = this.transformMongoose(user._doc);
				return resolve(transformedUser);
			}

			return reject("Could not find user");
		})
	}

	private transformMongoose(doc: any): IUserDto {
		const { _id, ...rest } = doc;
		return { id: _id.toString(), ...rest };
	}
}