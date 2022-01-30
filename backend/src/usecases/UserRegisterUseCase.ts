import IUserWriteOnlyRepository from "../application/repositories/IUserWriteOnlyRepository";
import IUserDto from "./data_tranfer_objects/IUserDto";
import IUserRegisterUseCase from "./IUserRegisterUseCase";

export default class UserRegisterUseCase implements IUserRegisterUseCase{
	userWriteOnlyRepository: IUserWriteOnlyRepository;

	constructor(_userWriteOnlyRepository: IUserWriteOnlyRepository){
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
	}

	invoke(userDto: IUserDto): Promise<IUserDto> {
		return new Promise((resolve, reject) => {
			try{
				let createdUser = this.userWriteOnlyRepository.create(userDto);

				resolve(createdUser)
			} catch (error) {
				reject('User could not be registered');
			}
		});
	}
	
}