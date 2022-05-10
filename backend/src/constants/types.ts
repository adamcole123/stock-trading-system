import ISendEmailUseCase from '../usecases/Email/ISendEmailUseCase';
export const TYPES = {
	UserServiceLocator : Symbol.for("UserServiceLocator"),
	StockServiceLocator : Symbol.for("StockServiceLocator"),
	TradeServiceLocator : Symbol.for("TradeServiceLocator"),
	ReportServiceLocator : Symbol.for("ReportServiceLocator"),
	EmailServiceLocator : Symbol.for("EmailServiceLocator"),
	IUserWriteOnlyRepository: Symbol.for("IUserWriteOnlyRepository"),
	IUserReadOnlyRepository: Symbol.for("IUserReadOnlyRepository"),
	IStockWriteOnlyRepository: Symbol.for("IStockWriteOnlyRepository"),
	IStockReadOnlyRepository: Symbol.for("IStockReadOnlyRepository"),
	ITradeWriteOnlyRepository: Symbol.for("ITradeWriteOnlyRepository"),
	ITradeReadOnlyRepository: Symbol.for("ITradeReadOnlyRepository"),
}