import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
	id: String,
	report_data: String,
	report_type: {
		type: String,
		enum: ["CSV", "XML"]
	},
	report_date: {
		type: Date,
		default: new Date(),
	}
})

export default reportSchema;