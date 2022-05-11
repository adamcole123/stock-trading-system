import IUserWriteOnlyRepository from "../../application/repositories/IUserWriteOnlyRepository";
import IUserDto from "../data_tranfer_objects/IUserDto";

export default interface IEditUserDetailsUseCase {
	userWriteOnlyRepository: IUserWriteOnlyRepository;

	invoke(username: String, userDto: IUserDto): Promise<IUserDto>;
}