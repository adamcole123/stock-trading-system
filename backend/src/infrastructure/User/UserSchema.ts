import mongoose from 'mongoose';
import Role from '../../usecases/entities/Role';
import Report from './ReportSchema';
import CardDetails from './CardDetailsSchema';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	firstName: String,
	lastName: String,
	birthDate: Date,
	reports: [Report],
	id: mongoose.SchemaTypes.ObjectId,
	password: {
		type: String,
		required: true
	},
	credit: Number,
	role: {
		type: String,
		enum: ['Admin', 'Broker', 'User'],
		required: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	cardDetails: [CardDetails]
}, { collection: 'users' })

export default userSchema;