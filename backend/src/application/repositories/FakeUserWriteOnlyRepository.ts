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

	edit(userDto: IUserDto): Promise<IUserDto> {
		return new Promise((resolve, reject) => {
			let foundUser = users.find(x => x.username == userDto.username);

			if(foundUser){
				for(const key in userDto){
					if(key){
						foundUser[key] = userDto[key];
					}
				}
				resolve(foundUser);
			}

			throw new Error('Could not find user to edit');
		});
	}
}