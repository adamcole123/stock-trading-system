import TradeType from "../entities/TradeType";

export default interface ITradeDto {
	id?: string,
	stock_id?: string,
	user_id?: string,
	stock_value?: number,
	stock_amount?: number,
	time_of_trade?: Date,
	trade_type?: string
}