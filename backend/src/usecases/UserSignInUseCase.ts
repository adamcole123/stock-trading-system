import IUserDto from './data_tranfer_objects/IUserDto';
import IUserSignInUseCase from './IUserSignInUseCase';
import IUserReadOnlyRepository from '../application/repositories/IUserReadOnlyRepository';
import bcrypt from 'bcryptjs';
import { userInfo } from 'os';

export default class UsersignInUseCase implements IUserSignInUseCase{
	userReadOnlyRepository: IUserReadOnlyRepository;

	constructor(_userReadOnlyRepository: IUserReadOnlyRepository){
		this.userReadOnlyRepository = _userReadOnlyRepository;
	}

	invoke(userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			let foundUser = await this.userReadOnlyRepository.fetch(userDto);
			
			if(await bcrypt.compare(foundUser.password, userDto.password)){
				resolve(foundUser);
			}
	
			reject('Authentication unsuccessful');
		})
	}
}