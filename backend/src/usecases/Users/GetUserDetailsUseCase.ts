import IUserDto from '../data_tranfer_objects/IUserDto';
import IGetUserDetailsUseCase from './IGetUserDetailsUseCase';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';

export default class GetUserDetailsUseCase implements IGetUserDetailsUseCase{
	private userReadOnlyRepository: IUserReadOnlyRepository;
	/**
	 *
	 */
	constructor(_userReadOnlyRepository: IUserReadOnlyRepository) {
		this.userReadOnlyRepository = _userReadOnlyRepository;
	}

	async invoke(userDto: IUserDto): Promise<IUserDto> {
		let user = await this.userReadOnlyRepository.fetch({ username: userDto.username });

		user.password = undefined;
		user.cardDetails = undefined;
		user.reports = undefined;
		return Promise.resolve(user);
	}

}