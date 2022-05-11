import IUserDto from "../data_tranfer_objects/IUserDto";

export default interface IPasswordResetUseCase {
	invoke(userDto: IUserDto): Promise<void>
}