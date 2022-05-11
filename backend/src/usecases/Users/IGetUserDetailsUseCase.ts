import IUserDto from '../data_tranfer_objects/IUserDto';
export default interface IGetUserDetailsUseCase {
	invoke(userDto: IUserDto): Promise<IUserDto>;
}