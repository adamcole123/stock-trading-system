import IUserWriteOnlyRepository from "../../application/repositories/IUserWriteOnlyRepository";
import IUserDto from "../data_tranfer_objects/IUserDto";
import IUserRegisterUseCase from "./IUserRegisterUseCase";

export default class UserRegisterUseCase implements IUserRegisterUseCase{
	userWriteOnlyRepository: IUserWriteOnlyRepository;

	constructor(_userWriteOnlyRepository: IUserWriteOnlyRepository){
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
	}

	invoke(userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			try{
				let createdUser = await this.userWriteOnlyRepository.create(userDto);

				createdUser.password = "";

				resolve(createdUser)
			} catch (error) {
				reject('User could not be registered');
			}
		});
	}
	
}