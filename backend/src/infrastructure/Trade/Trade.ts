import mongoose from 'mongoose';
import tradeSchema from './TradeSchema';

export default mongoose.model('Trade', tradeSchema);