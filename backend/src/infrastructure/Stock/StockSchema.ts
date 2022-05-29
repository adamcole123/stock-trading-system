import mongoose from "mongoose";
import Stock from '../../usecases/entities/Stock';
import Double from '@mongoosejs/double';

var Schema = mongoose.Schema;

const stockSchema = new Schema<Stock>({
	id: mongoose.SchemaTypes.ObjectId,
	symbol: String,
	name: String,
	value: Double,
	volume: Number,
	open: Double,
	close: Double,
	latest_trade: Date
}, { collection: 'stocks' })

export default stockSchema;