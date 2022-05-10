export default interface CardDetails {
  id: string;
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
