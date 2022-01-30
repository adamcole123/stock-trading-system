import IUserReadOnlyRepository from "../application/repositories/IUserReadOnlyRepository";
import IUserDto from "./data_tranfer_objects/IUserDto";

export default interface IUserSignInUseCase{
	userReadOnlyRepository: IUserReadOnlyRepository;

	invoke(userDto: IUserDto): Promise<IUserDto>
}