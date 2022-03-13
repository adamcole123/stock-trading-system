import { injectable, inject } from "inversify";
import IUserReadOnlyRepository from "../application/repositories/IUserReadOnlyRepository";
import IUserWriteOnlyRepository from "../application/repositories/IUserWriteOnlyRepository";
import { TYPES } from "../constants/types";
import IUserRegisterUseCase from "../usecases/Users/IUserRegisterUseCase";
import IUserSignInUseCase from "../usecases/Users/IUserSignInUseCase";
import UserRegisterUseCase from "../usecases/Users/UserRegisterUseCase";
import UserSignInUseCase from "../usecases/Users/UserSignInUseCase";
import IValidateUserTokenUseCase from '../usecases/Users/IValidateUserTokenUseCase';
import ValidateUserTokenUseCase from "../usecases/Users/ValidateUserTokenUseCase";
import IEditUserDetailsUseCase from '../usecases/Users/IEditUserDetailsUseCase';
import EditUserDetailsUseCase from '../usecases/Users/EditUserDetailsUseCase';

@injectable()
export default class UserServiceLocator {

	constructor(@inject(TYPES.IUserReadOnlyRepository) private readRepository: IUserReadOnlyRepository, @inject(TYPES.IUserWriteOnlyRepository) private writeRepository: IUserWriteOnlyRepository){}

	public GetUserRegisterUseCase(): IUserRegisterUseCase {
		return new UserRegisterUseCase(this.writeRepository);
	}

	public GetUserSignInUseCase(): IUserSignInUseCase {
		return new UserSignInUseCase(this.readRepository);
	}

	public GetValidateUserTokenUseCase(): IValidateUserTokenUseCase {
		return new ValidateUserTokenUseCase();
	}
	public GetEditUserDetailsUseCase(): IEditUserDetailsUseCase {
		return new EditUserDetailsUseCase(this.writeRepository);
	}
}