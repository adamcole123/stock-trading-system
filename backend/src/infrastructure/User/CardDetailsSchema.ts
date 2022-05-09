import mongoose from "mongoose";

const cardDetailsSchema = new mongoose.Schema({
	id: String,
	cardNumber: String,
	expiryDate: Date,
	cvv: String,
	nameOnCard: String,
	addressLine1: String,
	city: String,
	county: String,
	postcode: String,
	country: String,
})

export default cardDetailsSchema;