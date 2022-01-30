import IUserDto from "../../usecases/data_tranfer_objects/IUserDto"
import User from "../../usecases/entities/User"

export default interface IUserReadOnlyRepository {
	fetchAll(): Promise<IUserDto[]>
	fetch(userDto: IUserDto): Promise<IUserDto>
}