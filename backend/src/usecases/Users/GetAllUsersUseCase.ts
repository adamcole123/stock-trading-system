import IUserDto from '../data_tranfer_objects/IUserDto';
import IGetAllUsersUseCase from './IGetAllUsersUseCase';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';

export default class GetAllUsersUseCase implements IGetAllUsersUseCase {
	private userReadOnlyRepository: IUserReadOnlyRepository;
	/**
	 *
	 */
	constructor(_userReadOnlyRepository: IUserReadOnlyRepository) {
		this.userReadOnlyRepository = _userReadOnlyRepository;
	}

	async invoke(): Promise<IUserDto[]> {
		let allUsers = await this.userReadOnlyRepository.fetchAll();
		return allUsers;
	}

}