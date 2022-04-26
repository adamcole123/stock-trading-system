import mongoose from "mongoose";
import Stock from '../../usecases/entities/Stock';

var Schema = mongoose.Schema;

const stockSchema = new Schema<Stock>({
	id: mongoose.SchemaTypes.ObjectId,
	symbol: String,
	name: String,
	value: Number,
	volume: Number,
	open: Number,
	close: Number
}, { collection: 'stocks' })

export default stockSchema;