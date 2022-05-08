import ICreditCardDto from '../data_tranfer_objects/ICreditCardDto';
import IAddNewCreditCardUseCase from './IAddNewCreditCardUseCase';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserWriteOnlyRepository from 'src/application/repositories/IUserWriteOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';
export default class AddNewCreditCardUseCase implements IAddNewCreditCardUseCase{
	userReadOnlyRepository: IUserReadOnlyRepository;
	userWriteOnlyRepository: IUserWriteOnlyRepository;
	
	constructor(_userReadOnlyRepository: IUserReadOnlyRepository,
				_userWriteOnlyRepository: IUserWriteOnlyRepository) {
		this.userReadOnlyRepository = _userReadOnlyRepository;
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
	}

	async invoke(creditCardDto: ICreditCardDto, userId: string): Promise<IUserDto> {
		let user = await this.userReadOnlyRepository.fetch({
			id: userId
		})
		user.cardDetails?.push(creditCardDto);

		let edittedUser = await this.userWriteOnlyRepository.edit(user.username!, { cardDetails: user.cardDetails }, {});

		if(edittedUser)
			return edittedUser;

		throw new Error('Could not add credit card');
	}
}