import { promises } from 'stream';
import IValidateUserTokenUseCase from './IValidateUserTokenUseCase';
import jwt, { JwtPayload } from 'jsonwebtoken';
import IUserDto from '../data_tranfer_objects/IUserDto';
import CardDetails from '../entities/CardDetails';

export default class ValidateUserTokenUseCase implements IValidateUserTokenUseCase{
	invoke(token: string): Promise<IUserDto> {
		return new Promise((resolve, reject) => {
			// Tokens are generally passed in the header of the request
			// Due to security reasons.

			let jwtSecretKey = process.env.JWT_SECRET_KEY;
		
			try {		
				let verified = <IUserDto>jwt.verify(token, jwtSecretKey!);
				if(verified){
					verified.password = "";
					if(verified.cardDetails){
						verified.cardDetails.map(card => {
							card.cardNumber = card.cardNumber.substring(11, 15)
							card.securityCode = ""
						});
					}

					resolve(verified);
				}else{
					// Access Denied
					reject('Could not validate user');
				}
			} catch (error) {
				// Access Denied
				reject('Could not validate user');
			}
		});
	}
}