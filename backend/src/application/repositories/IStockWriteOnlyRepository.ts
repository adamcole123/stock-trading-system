import IStockDto from "../../usecases/data_tranfer_objects/IStockDto";
import StockWriteOptions from "./StockWriteOptions";

export default interface IStockWriteOnlyRepository {
	create(userDto: IStockDto): Promise<IStockDto>;
	edit(stockDto: IStockDto, options?: StockWriteOptions): Promise<IStockDto[]>;
}