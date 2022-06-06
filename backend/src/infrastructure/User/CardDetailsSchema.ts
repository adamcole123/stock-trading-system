import mongoose from "mongoose";

const cardDetailsSchema = new mongoose.Schema({
	id: String,
	cardDetails: String,
	key: String
})

export default cardDetailsSchema;