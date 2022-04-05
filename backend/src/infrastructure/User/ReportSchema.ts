import mongoose from 'mongoose';
import ReportType from '../../usecases/entities/ReportType';

const reportSchema = new mongoose.Schema({
	id: String,
	report_data: String,
	report_type: {
		type: String,
		enum: ['CSV', 'XML']
	}
})

export default reportSchema;