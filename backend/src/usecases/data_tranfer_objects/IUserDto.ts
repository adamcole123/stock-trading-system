import Report from "../entities/Report";

export default interface IUserDto {
	id: string,
	username: string,
	email: string,
	password: string,
	firstName: string,
	lastName: string,
	birthDate: Date,
	reports: Report[]
}