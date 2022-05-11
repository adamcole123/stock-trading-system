import IStockDto from "../data_tranfer_objects/IStockDto";

export default interface IEditStockUseCase {
	invoke(stockDto: IStockDto): Promise<IStockDto[]>
}