import mongoose from 'mongoose';
import Trade from '../../usecases/entities/Trade';

var Schema = mongoose.Schema;

const tradeSchema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		unique: false,
		index: true
	},
	stock_id: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: true,
		unique: false,
		index: true
	},
	stock_amount: {
		type: Number,
		required: true
	},
	stock_value: {
		type: Number,
		required: true
	},
	time_of_trade: {
		type: Date,
		required: true,
		default: new Date()
	},
	trade_status: {
		type: String,
		enum: ['Approved', 'Declined', 'Pending'],
		required: true,
		default: 'Pending'
	},
	trade_type: {
		type: String,
		enum: ['Buy', 'Sell'],
		required: true,
	}
}, { collection: 'trades' })


export default tradeSchema;