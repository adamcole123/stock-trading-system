import IUserWriteOnlyRepository from "../../application/repositories/IUserWriteOnlyRepository";
import IUserDto from "../data_tranfer_objects/IUserDto";

export default interface IEditUserDetailsUseCase {
	userWriteOnlyRepository: IUserWriteOnlyRepository;

	invoke(userDto: IUserDto): Promise<IUserDto>;
}