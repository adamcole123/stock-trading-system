import mongoose from 'mongoose';

var Schema = mongoose.Schema;

const tradeSchema = new mongoose.Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		unique: true,
		required: true
	},
	stock_id: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		unique: true,
		required: true
	},
	stock_amount: {
		type: Number,
		unique: true,
		required: true
	},
	stock_value: {
		type: Number,
		unique: true,
		required: true
	},
	time_of_trade: {
		type: Date,
		unique: true,
		required: true,
		default: new Date()
	},
	trade_status: {
		type: String,
		enum: ['Approved', 'Declined', 'Pending'],
		required: true,
		default: 'Pending'
	}
}, { collection: 'trades' })

export default tradeSchema;