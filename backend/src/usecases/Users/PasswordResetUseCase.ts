import IUserDto from '../data_tranfer_objects/IUserDto';
import IPasswordResetUseCase from './IPasswordResetUseCase';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import bcrypt from 'bcryptjs';

export default class PasswordResetUseCase implements IPasswordResetUseCase {
	private userReadOnlyRepository: IUserReadOnlyRepository;
	private userWriteOnlyRepository: IUserWriteOnlyRepository;

	constructor(_userReadOnlyRepository: IUserReadOnlyRepository,
				_userWriteOnlyRepository: IUserWriteOnlyRepository) {
		this.userReadOnlyRepository = _userReadOnlyRepository;
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
	}
	async invoke(userDto: IUserDto): Promise<void> {
		let user = await this.userReadOnlyRepository.fetch({ email: userDto.email });
		try {
			bcrypt.genSalt(10, async (err, salt) => {
				userDto.password = await bcrypt.hash(userDto.password!, salt);
				await this.userWriteOnlyRepository.edit(user.username!, userDto, {});
			})
		} catch (error) {
			Promise.reject('Could not change password');
		}
	}

}