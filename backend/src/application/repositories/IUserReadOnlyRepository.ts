import User from "../../usecases/entities/User"

export default interface IUserReadOnlyRepository {
	fetchAll(): Promise<User[]>
	fetch(user: User): Promise<User>
}