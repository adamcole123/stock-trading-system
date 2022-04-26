import { injectable } from "inversify";
import IUserReadOnlyRepository from "../application/repositories/IUserReadOnlyRepository";
import IUserDto from "../usecases/data_tranfer_objects/IUserDto";
import users from './FakeUserData';

@injectable()
export default class FakeUserReadOnlyRepository implements IUserReadOnlyRepository {

	constructor() {
	}

	fetchAll(): Promise<IUserDto[]> {
		throw new Error('Method not implemented.');
	}
	fetch(userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			let foundUser = users.find(x => x.username == userDto.username);
			
			if(!foundUser){
				reject('Could not find user');
			} else{	
				resolve(foundUser);
			}
			
		})
	}
}