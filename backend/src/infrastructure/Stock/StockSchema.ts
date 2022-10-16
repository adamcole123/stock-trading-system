import mongoose from "mongoose";
import Stock from '../../usecases/entities/Stock';
import Double from '@mongoosejs/double';
var Schema = mongoose.Schema;

const stockSchema = new Schema<Stock>({
	id: mongoose.SchemaTypes.ObjectId,
	symbol: {
		type: String,
		index: true
	},
	name: {
		type: String,
		index: true
	},
	value: {
		type: Double,
		min: 0,
		index: true
	},
	volume: Number,
	open: {
		type: Double,
		default: 0.0
	},
	close: {
		type: Double,
		default: 0.0
	},
	latest_trade: {
		type: Date,
		default: null
	},
	gains: {
		type: Double,
		default: 0.0,
	}
}, { collection: 'stocks' })

stockSchema.pre('save', function (next) {
    this.gains = calcGains(this.get('value'), this.get('open'));
	this.symbol = this.symbol.toUpperCase();
    next();
});

function calcGains (value: number, open: number) {
	return Number.parseFloat((value! - open!).toFixed(2))!;
};

export default stockSchema;