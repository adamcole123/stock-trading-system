import mongoose from "mongoose";

const cardDetailsSchema = new mongoose.Schema({
	id: String,
	cardNumber: String,
	expirationDate: String,
	securityCode: String
})

export default cardDetailsSchema;