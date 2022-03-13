import IStockDto from "../../usecases/data_tranfer_objects/IStockDto"

export default interface IStockReadOnlyRepository {
	fetchAll(): Promise<IStockDto[]>
	fetch(stockDto: IStockDto): Promise<IStockDto[]>
}