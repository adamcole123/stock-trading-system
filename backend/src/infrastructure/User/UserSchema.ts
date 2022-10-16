import mongoose from 'mongoose';
import Role from '../../usecases/entities/Role';
import Report from './ReportSchema';
import CardDetails from './CardDetailsSchema';

var Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		index: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		index: true
	},
	firstName: String,
	lastName: String,
	birthDate: {
		type: Date,
		default: undefined
	},
	reports: [Report],
	id: mongoose.SchemaTypes.ObjectId,
	password: {
		type: String,
		required: true
	},
	credit: {
		type: Number,
		set: function (v: Number) { return parseFloat(v.toFixed(2));}
	},
	role: {
		type: String,
		enum: ['Admin', 'Broker', 'User'],
		required: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	cardDetails: [CardDetails],
	activationDate: {
		type: Date,
		default: undefined
	},
	banUntil: {
		type: Date,
		default: undefined
	}
}, { collection: 'users' })



export default userSchema;