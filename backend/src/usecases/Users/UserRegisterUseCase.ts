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
				// Check password conditions:
				// 7 characters
     			// Must contain letters and numbers
				if(!userDto.password){
					return reject("Password not entered");
				}
				
				if(userDto.password!.length < 6){
					return reject("Password must have 7 characters");
				}

				var passw=/^([A-Za-z]|[0-9])$/;

				if(userDto.password.match(passw)){
					reject("Password must have atleast one letter and one number");
				}

				userDto.credit = 50000;
				let createdUser = await this.userWriteOnlyRepository.create(userDto);

				createdUser.password = "";

				resolve(createdUser)
			} catch (error) {
				reject('User could not be registered');
			}
		});
	}
	
}