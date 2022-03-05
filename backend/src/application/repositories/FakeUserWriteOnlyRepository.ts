import IUserDto from "../../usecases/data_tranfer_objects/IUserDto";
import IUserWriteOnlyRepository from "./IUserWriteOnlyRepository";
import users from './FakeUserData';
import User from "../../usecases/entities/User";
import { KeyObject } from "crypto";
import { isKeyObject } from "util/types";

export default class FakeUserWriteOnlyRepository implements IUserWriteOnlyRepository {

	constructor() {
	}

	create(userDto: IUserDto): Promise<IUserDto> {
		throw new Error('Method not implemented.');
	}

	edit(username: String, userDto: IUserDto): Promise<IUserDto> {
		return new Promise((resolve, reject) => {
			let foundUser: IUserDto | undefined = users.find(x => x.username == username);

			if(foundUser){
				for(const key in foundUser){
					if(key in userDto){
						(foundUser as any)[key] = (userDto as any)[key];
					}
				}
				foundUser = userDto;
				resolve(foundUser);
			}

			reject('Could not find user to edit');
		});
	}
}