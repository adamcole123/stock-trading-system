export default interface ICreditCardDto {
	cardNumber: string;
	expiryDate: Date;
	cvv: string;
	nameOnCard: string;
	addressLine1: string;
	city: string;
	county: string;
	postcode: string;
	country: string;
}