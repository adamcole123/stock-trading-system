import TradeType from "./TradeType";

export default class Trade {	
	constructor(
		public stock_id: string,
		public user_id: string,
		public stock_value?: number,
		public stock_amount?: number,
		public time_of_trade?: Date,
		public trade_type?: string
	){
	}
}