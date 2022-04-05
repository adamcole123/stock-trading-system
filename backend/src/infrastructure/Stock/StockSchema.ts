import mongoose from "mongoose";
import Stock from '../../usecases/entities/Stock';

const stockSchema = new mongoose.Schema<Stock>({
	id: mongoose.SchemaTypes.ObjectId,
	symbol: String,
	name: String,
	value: Number,
	volume: Number,
	open: Number,
	close: Number
}, { collection: 'stocks' })

export default stockSchema;