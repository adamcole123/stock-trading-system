export default class CardDetails {
	constructor (
		public cardNumber: string,
		public expiryDate: string,
		public cvv: string,
		public nameOnCard: string,
		public addressLine1: string,
		public city: string,
		public county: string,
		public postcode: string,
		public country: string,
	) {

	}
}