import { promises } from 'stream';
import IValidateUserTokenUseCase from './IValidateUserTokenUseCase';
import jwt, { JwtPayload } from 'jsonwebtoken';
import IUserDto from '../data_tranfer_objects/IUserDto';
import CardDetails from '../entities/CardDetails';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IEncrypter from '../../infrastructure/IEncrypter';
import { prototype } from 'events';
import { stringify } from 'querystring'
import moment from 'moment';

export default class ValidateUserTokenUseCase implements IValidateUserTokenUseCase{
	private userReadOnlyRepository: IUserReadOnlyRepository;
	private encrypter: IEncrypter;

	/**
	 *
	 */
	constructor(_userReadOnlyRepository: IUserReadOnlyRepository,
				_encrypter: IEncrypter) {
		this.userReadOnlyRepository = _userReadOnlyRepository;
		this.encrypter = _encrypter;
	}
	invoke(token: string): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			// Tokens are generally passed in the header of the request
			// Due to security reasons.

			let jwtSecretKey = process.env.JWT_SECRET_KEY;
		
			try {		
				console.log("token: ", token);
				let verified = <IUserDto>jwt.verify(token, jwtSecretKey!)
				console.log("verifieddata: ", verified);
				if(verified){
					verified = await this.userReadOnlyRepository.fetch({id: verified.id})

					console.log("token: ", verified)

					if(verified.isDeleted)
						reject('User account is closed.');

					if(verified.banUntil !== undefined){
						if(verified.banUntil! > new Date())
							reject(`User account is currently banned until ${moment(verified.banUntil).locale}.`);
					}

					verified.password = "";
					if(verified.cardDetails){
						let newCardDetails = verified.cardDetails.map((card: any) => {
							let decryptedCardDetails: CardDetails = card.cardDetails !== undefined && card.key !== undefined ? 
																	JSON.parse(this.encrypter.decypher(card.cardDetails, card.key)) 
																	: { cardNumber: "", cvv: "" };

							decryptedCardDetails.cardNumber = decryptedCardDetails.cardNumber !== undefined ? 
															decryptedCardDetails.cardNumber.substring(11, 15) : "";
							
							decryptedCardDetails.cvv = "";

							return {...decryptedCardDetails};
						});

						verified.cardDetails = newCardDetails;
					}

					verified.reports = verified.reports?.map(report => {
						return {
							report_date: report.report_date,
							report_type: report.report_type,
							id: report.id
						}
					})

					verified.id = verified.id?.toString();

					return resolve(verified);
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