import IUserWriteOnlyRepository from "../application/repositories/IUserWriteOnlyRepository";
import IUserDto from "./data_tranfer_objects/IUserDto";

export default interface IUserRegisterUseCase {
	userWriteOnlyRepository: IUserWriteOnlyRepository;

	invoke(userDto: IUserDto): Promise<IUserDto>
}