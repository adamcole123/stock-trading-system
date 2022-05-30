import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';
import IEditUserDetailsUseCase from './IEditUserDetailsUseCase';
import jwt from 'jsonwebtoken';

export default class EditUserDetailsUseCase implements IEditUserDetailsUseCase {
	userWriteOnlyRepository: IUserWriteOnlyRepository;

	constructor(_userWriteOnlyRepository: IUserWriteOnlyRepository) {
		this.userWriteOnlyRepository = _userWriteOnlyRepository;		
	}

	invoke(username: string, userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			try{
				delete userDto.username;

				let editedUser: IUserDto = await this.userWriteOnlyRepository.edit(username, userDto, {});

				resolve(editedUser);
			} catch (e) {
				reject('Could not edit user details: ' + e);
			}
		});

	}
	
}