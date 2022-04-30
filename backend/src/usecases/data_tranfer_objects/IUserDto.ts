import CardDetails from "../entities/CardDetails";
import Report from "../entities/Report";
import Role from "../entities/Role";
import IReportDto from './IReportDto';

export default interface IUserDto {
	id?: string,
	username?: string,
	email?: string,
	password?: string,
	firstName?: string,
	lastName?: string,
	birthDate?: Date,
	reports?: IReportDto[],
	credit?: Number,
	role?: Role,
	isDeleted?: boolean,
	cardDetails?: CardDetails[]
}