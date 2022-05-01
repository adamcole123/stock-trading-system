import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';
import IEditUserDetailsUseCase from './IEditUserDetailsUseCase';
import jwt from 'jsonwebtoken';

export default class EditUserDetailsUseCase implements IEditUserDetailsUseCase {
	userWriteOnlyRepository: IUserWriteOnlyRepository;

	constructor(_userWriteOnlyRepository: IUserWriteOnlyRepository) {
		this.userWriteOnlyRepository = _userWriteOnlyRepository;		
	}

	invoke(username: string, userDto: IUserDto, token: string): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			try{
				let signedInUser = <IUserDto>jwt.verify(token, process.env.JWT_SECRET_KEY!);

				if(signedInUser.username != username && signedInUser.role != "Admin"){
					reject("Only an administrator and the signed in user can edit their details");
				}
				let editedUser: IUserDto = await this.userWriteOnlyRepository.edit(username, userDto, {});

				resolve(editedUser);
			} catch (e) {
				reject('Could not edit user details: ' + e);
			}
		});

	}
	
}