import IUserDto from "../data_tranfer_objects/IUserDto";

export default interface IActivateUserAccountUseCase {
	invoke(userDto: IUserDto): Promise<IUserDto>
}