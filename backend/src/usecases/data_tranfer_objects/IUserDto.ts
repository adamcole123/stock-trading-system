import Report from "../entities/Report";

export default interface IUserDto {
	[x: string]: any;
	id?: string,
	username?: string,
	email?: string,
	password?: string,
	firstName?: string,
	lastName?: string,
	birthDate?: Date,
	reports?: Report[]
}