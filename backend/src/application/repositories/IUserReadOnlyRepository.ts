import IUserDto from "../../usecases/data_tranfer_objects/IUserDto"

export default interface IUserReadOnlyRepository {
	fetchAll(): Promise<IUserDto[]>
	fetch(userDto: IUserDto): Promise<IUserDto>
}