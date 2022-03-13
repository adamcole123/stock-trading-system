export default class CardDetails {
	constructor (
		public id: string,
		public cardNumber: string,
		public expirationDate: string,
		public securityCode?: string
	) {

	}
}