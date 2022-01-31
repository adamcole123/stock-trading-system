import IUserDto from './data_tranfer_objects/IUserDto';
import IUserWriteOnlyRepository from '../application/repositories/IUserWriteOnlyRepository';
export default interface IEditUserDetailsUseCase {
	userWriteOnlyRepository: IUserWriteOnlyRepository;

	invoke(userDto: IUserDto): Promise<IUserDto>;
}