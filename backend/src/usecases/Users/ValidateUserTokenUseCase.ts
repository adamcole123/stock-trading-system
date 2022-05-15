import { promises } from 'stream';
import IValidateUserTokenUseCase from './IValidateUserTokenUseCase';
import jwt, { JwtPayload } from 'jsonwebtoken';
import IUserDto from '../data_tranfer_objects/IUserDto';
import CardDetails from '../entities/CardDetails';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';

export default class ValidateUserTokenUseCase implements IValidateUserTokenUseCase{
	private userReadOnlyRepository: IUserReadOnlyRepository;

	/**
	 *
	 */
	constructor(_userReadOnlyRepository: IUserReadOnlyRepository) {
		this.userReadOnlyRepository = _userReadOnlyRepository;
	}
	invoke(token: string): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			// Tokens are generally passed in the header of the request
			// Due to security reasons.

			let jwtSecretKey = process.env.JWT_SECRET_KEY;
		
			try {		
				let verified = <IUserDto>jwt.verify(token, jwtSecretKey!);
				if(verified){
					verified = await this.userReadOnlyRepository.fetch({id: verified.id})

					if(verified.isDeleted)
						reject('User account is closed.');

					verified.password = "";
					if(verified.cardDetails){
						verified.cardDetails.map(card => {
							card.cardNumber = card.cardNumber.substring(11, 15)
							card.cvv = ""
						});
					}

					resolve(verified);
				}else{
					// Access Denied
					return reject('Could not validate user');
				}
			} catch (error) {
				// Access Denied
				return reject('Could not validate user');
			}
		});
	}
}