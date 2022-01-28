import Report from "./Report";

export default class User {
	constructor(
		public id: string,
		public username: string,
		public password: string,
		public email: string,
		public firstName: string,
		public lastName: string,
		public birthDate: Date,
		public reports: Report[]
	){

	}
}