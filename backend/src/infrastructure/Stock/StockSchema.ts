import mongoose from "mongoose";
import Stock from '../../usecases/entities/Stock';
import Double from '@mongoosejs/double';
var Schema = mongoose.Schema;

const stockSchema = new Schema<Stock>({
	id: mongoose.SchemaTypes.ObjectId,
	symbol: String,
	name: String,
	value: {
		type: Double,
		min: 0,
	},
	volume: Number,
	open: Double,
	close: Double,
	latest_trade: Date,
	gains: {
		type: Double,
		default: calcGains,
		get: calcGains,
		set: calcGains,
	}
}, { collection: 'stocks' })

function calcGains (this: Stock) {
	return this.value! - this.open!;
};

export default stockSchema;