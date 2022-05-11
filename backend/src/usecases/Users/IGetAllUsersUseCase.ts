import IUserDto from "../data_tranfer_objects/IUserDto";

export default interface IGetAllUsersUseCase {
	invoke(): Promise<IUserDto[]>;
}