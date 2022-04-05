import mongoose from 'mongoose';
import stockSchema from './StockSchema';
import Stock from '../../usecases/entities/Stock';

export default mongoose.model<Stock>('Stock', stockSchema);