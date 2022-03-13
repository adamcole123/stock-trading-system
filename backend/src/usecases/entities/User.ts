import Report from "./Report";
import Role from "./Role";
import CardDetails from './CardDetails';

export default class User {
	constructor(
		public username: string,
		public email: string,
		public firstName: string,
		public lastName: string,
		public birthDate?: Date,
		public reports?: Report[],
		public id?: string,
		public password?: string,
		public credit?: Number,
		public role?: Role,
		public isDeleted?: boolean,
		public cardDetails?: CardDetails[]
	){

	}
}