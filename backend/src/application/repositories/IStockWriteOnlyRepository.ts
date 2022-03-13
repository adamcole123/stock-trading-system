import IStockDto from "../../usecases/data_tranfer_objects/IStockDto";

export default interface IStockWriteOnlyRepository {
	create(userDto: IStockDto): Promise<IStockDto>;
	edit(symbol: String, stockDto: IStockDto): Promise<IStockDto>;
}