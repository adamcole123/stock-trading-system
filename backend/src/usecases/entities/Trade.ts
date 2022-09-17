import IStockDto from "../data_tranfer_objects/IStockDto";
import TradeType from "./TradeType";

export default class Trade {	
	constructor(
		public stock_id: any,
		public user_id: string,
		public stock_value?: number,
		public stock_amount?: number,
		public time_of_trade?: Date,
		public trade_type?: string
	){
	}
}