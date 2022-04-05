import IUserSignInUseCase from './IUserSignInUseCase';
import bcrypt from 'bcryptjs';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';

export default class UserSignInUseCase implements IUserSignInUseCase{
	userReadOnlyRepository: IUserReadOnlyRepository;
	bc = bcrypt;

	constructor(_userReadOnlyRepository: IUserReadOnlyRepository){
		this.userReadOnlyRepository = _userReadOnlyRepository;
	}

	invoke(userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			let foundUser: IUserDto;
			try{
				foundUser = await this.userReadOnlyRepository.fetch(userDto);
			} catch (err) {
				return reject(err);
			}

			let passwordCheck;
			
			if(userDto!.password && foundUser!.password) {
				passwordCheck = this.bc.compareSync(userDto.password, foundUser!.password);
			}
			
			if(passwordCheck){
				foundUser!.password = '';

				return resolve(foundUser!);
			}
	
			reject('Authentication unsuccessful');
		})
	}
}