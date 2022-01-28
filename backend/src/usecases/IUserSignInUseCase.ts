import IUserDto from "./data_tranfer_objects/IUserDto";

export default interface IUserSignInUseCase {
	invoke(userDto: IUserDto): Promise<IUserDto>
}