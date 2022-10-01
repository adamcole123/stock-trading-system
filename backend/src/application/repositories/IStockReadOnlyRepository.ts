import IStockDto from "../../usecases/data_tranfer_objects/IStockDto"
import StockReadOptions from "./StockReadOptions"

export default interface IStockReadOnlyRepository {
	fetchAll(): Promise<IStockDto[]>
	fetch(stockDto?: IStockDto | IStockDto[], options?: StockReadOptions): Promise<IStockDto[]>
	count(): any
}