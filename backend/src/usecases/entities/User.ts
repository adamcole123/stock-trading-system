import Report from "./Report";

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
	){

	}
}