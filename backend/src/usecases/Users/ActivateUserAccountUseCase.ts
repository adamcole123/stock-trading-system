import IUserDto from '../data_tranfer_objects/IUserDto';
import IActivateUserAccountUseCase from './IActivateUserAccountUseCase';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';

export default class ActivateUserAccountUseCase implements IActivateUserAccountUseCase {

	private userWriteOnlyRepository: IUserWriteOnlyRepository;

	constructor(_userWriteOnlyRepository: IUserWriteOnlyRepository) {
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
	}

	invoke(userDto: IUserDto): Promise<IUserDto> {
		return this.userWriteOnlyRepository.edit(userDto.username!, { activationDate: new Date() }, {});
	}
}