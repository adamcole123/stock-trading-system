export default interface ITradeDto {
	stock_id: string,
	user_id: string,
	stock_value?: number,
	stock_amount?: number,
	time_of_trade?: Date,
}