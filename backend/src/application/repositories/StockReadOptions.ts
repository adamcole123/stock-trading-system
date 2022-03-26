import IStockDto from '../../usecases/data_tranfer_objects/IStockDto';
import GainsMode from "./GainsModes";
import IOrderOptions from "./IOrderOptions";
import ValueMode from "./ValueMode";
import VolumeMode from "./VolumeMode";

export default interface StockReadOptions {
	gainsMode?: GainsMode
	valueMode?: ValueMode
	volumeMode?: VolumeMode
	order?: IOrderOptions<keyof IStockDto>
	page?: number
}