import IStockDto from "../../usecases/data_tranfer_objects/IStockDto"
import StockOptions from "./StockOptions"

export default interface IStockReadOnlyRepository {
	fetchAll(): Promise<IStockDto[]>
	fetch(stockDto?: IStockDto, options?: StockOptions): Promise<IStockDto[]>
}