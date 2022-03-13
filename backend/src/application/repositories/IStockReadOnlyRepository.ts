import IStockDto from "../../usecases/data_tranfer_objects/IStockDto"

export default interface IStockReadOnlyRepository {
	fetchAll(): Promise<IStockDto[]>
	fetch(userDto: IStockDto): Promise<IStockDto>
}