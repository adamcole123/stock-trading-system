import IUserDto from "../../usecases/data_tranfer_objects/IUserDto";
import UserEditOptions from "./UserEditOptions";

export default interface IUserWriteOnlyRepository {
	create(userDto: IUserDto): Promise<IUserDto>;
	edit(username: string, userDto: IUserDto, userEditOptions: UserEditOptions): Promise<IUserDto>;
}