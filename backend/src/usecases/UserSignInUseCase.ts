import IUserDto from './data_tranfer_objects/IUserDto';
import IUserSignInUseCase from './IUserSignInUseCase';
import IUserReadOnlyRepository from '../application/repositories/IUserReadOnlyRepository';
import bcrypt from 'bcryptjs';
export default class UsersignInUseCase implements IUserSignInUseCase{
	userReadOnlyRepository: IUserReadOnlyRepository;
	bc = bcrypt;

	constructor(_userReadOnlyRepository: IUserReadOnlyRepository){
		this.userReadOnlyRepository = _userReadOnlyRepository;
	}

	invoke(userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			let foundUser = await this.userReadOnlyRepository.fetch(userDto);
			
			let passwordCheck = await this.bc.compareSync(userDto.password, foundUser.password);
			
			if(passwordCheck){
				foundUser.password = '';

				resolve(foundUser);
			}
	
			reject('Authentication unsuccessful');
		})
	}
}