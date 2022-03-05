import IUserWriteOnlyRepository from "../application/repositories/IUserWriteOnlyRepository";
import users from './FakeUserData';
import bcrypt from 'bcryptjs';
import IUserDto from "../usecases/data_tranfer_objects/IUserDto";
import User from "../usecases/entities/User";
import { injectable } from "inversify";

@injectable()
export default class FakeUserWriteOnlyRepository implements IUserWriteOnlyRepository {
	edit(username: String, userDto: IUserDto): Promise<IUserDto> {
		throw new Error("Method not implemented.");
	}
	create(user: IUserDto): Promise<IUserDto> {
		return new Promise((resolve, reject) => {
			if(users.find(x => x.username == user.username)){
				reject('Existing user already has that username')
			}

			users.push(new User(
				user.username!,
				user.email!,
				user.firstName!,
				user.lastName!,
				new Date(user.birthDate!),
				user.reports!,
				`test${users.length + 1}_id`,
				bcrypt.hashSync(user.password!, bcrypt.genSaltSync(10))
			))
			
			resolve(user)
		})
	}
}