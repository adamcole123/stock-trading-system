import IUserSignInUseCase from './IUserSignInUseCase';
import bcrypt from 'bcrypt';
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
			let foundUser;
			
			try{
				foundUser = await this.userReadOnlyRepository.fetch(userDto);
			} catch (err) {
				return reject(err);
			}

			if(foundUser.credit === 0) {
				return reject('This account does not have any credit.');
			}

			if(foundUser.isDeleted)
				return reject('User account is closed.');

			if(!foundUser.activationDate)
				return reject('Account not activated.')
			
			if(foundUser.banUntil! > new Date())
				return reject('Account is currently banned.')
				
			let passwordCheck;
			
			if(userDto!.password && foundUser!.password) {
				passwordCheck = await this.bc.compare(userDto.password, foundUser!.password);
			}

			if(passwordCheck){
				foundUser!.password = '';

				foundUser!.reports = [];
				foundUser!.cardDetails = [];
	
				return resolve(foundUser!);
			}
	
			reject('Password is incorrect');
		})
	}
}