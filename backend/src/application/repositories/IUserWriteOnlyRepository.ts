import IUserDto from "../../usecases/data_tranfer_objects/IUserDto";

export default interface IUserWriteOnlyRepository {
	create(userDto: IUserDto): Promise<IUserDto>;
	edit(username: String, userDto: IUserDto): Promise<IUserDto>;
}