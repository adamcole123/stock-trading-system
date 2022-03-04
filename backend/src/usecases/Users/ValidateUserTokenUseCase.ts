import { promises } from 'stream';
import IValidateUserTokenUseCase from './IValidateUserTokenUseCase';
import jwt from 'jsonwebtoken';
import IUserDto from '../data_tranfer_objects/IUserDto';

export default class ValidateUserTokenUseCase implements IValidateUserTokenUseCase{
	invoke(token: string): Promise<string | IUserDto> {
		return new Promise((reject, resolve) => {
			// Tokens are generally passed in the header of the request
			// Due to security reasons.

			let jwtSecretKey = process.env.JWT_SECRET_KEY;
		
			try {		
				const verified = jwt.verify(token, jwtSecretKey!);
				if(verified){
					resolve(verified);
				}else{
					// Access Denied
					reject("Could not verify user");
				}
			} catch (error) {
				// Access Denied
				return reject("Could not verify user");
			}
		});
	}
}