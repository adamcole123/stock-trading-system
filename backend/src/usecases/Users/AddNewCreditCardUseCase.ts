import ICreditCardDto from '../data_tranfer_objects/ICreditCardDto';
import IAddNewCreditCardUseCase from './IAddNewCreditCardUseCase';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserWriteOnlyRepository from 'src/application/repositories/IUserWriteOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';
import IEncrypter from 'src/infrastructure/IEncrypter';
export default class AddNewCreditCardUseCase implements IAddNewCreditCardUseCase {
	private userReadOnlyRepository: IUserReadOnlyRepository;
	private userWriteOnlyRepository: IUserWriteOnlyRepository;
	private encrypter: IEncrypter;

	constructor(_userReadOnlyRepository: IUserReadOnlyRepository,
		_userWriteOnlyRepository: IUserWriteOnlyRepository,
		_encrypter: IEncrypter) {
		this.userReadOnlyRepository = _userReadOnlyRepository;
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
		this.encrypter = _encrypter;
	}

	async invoke(creditCardDto: ICreditCardDto, userId: string): Promise<IUserDto> {
		let user = await this.userReadOnlyRepository.fetch({
			id: userId
		});

		let encryptedCardDetails = await this.encrypter.cypher(JSON.stringify(creditCardDto));

		if(!encryptedCardDetails)
			throw new Error('Could not encrypt card details');

		let newCard = {
			cardDetails: encryptedCardDetails[0],
			key: encryptedCardDetails[1]
		};

		try {
			return await this.userWriteOnlyRepository.addNewCard(user.username!, newCard);
		} catch (error) {
			throw new Error('Could not add credit card: ' + error);
		}
	}
}