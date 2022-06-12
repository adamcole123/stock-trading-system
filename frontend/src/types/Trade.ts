import Stock from "./Stock";

export default interface Trade {
  id?: string;
  stock_id?: string | Stock;
  user_id?: string;
  stock_value?: number;
  stock_amount?: number;
  time_of_trade?: Date;
  trade_type?: string;
  trade_status?: string;
}
