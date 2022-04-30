import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import IUserWriteOnlyRepository from "../application/repositories/IUserWriteOnlyRepository";
import IUserReadOnlyRepository from "../application/repositories/IUserReadOnlyRepository";
import IStockReadOnlyRepository from "../application/repositories/IStockReadOnlyRepository";
import IGenerateReportUseCase from '../usecases/Reports/IGenerateReportUseCase';
import GenerateReportUseCase from '../usecases/Reports/GenerateReportUseCase';
import DownloadReportUseCase from "../usecases/Reports/DownloadReportUseCase";
import IDownloadReportUseCase from "../usecases/Reports/IDownloadReportUseCase";

@injectable()
export default class TradeServiceLocator {
	constructor(@inject(TYPES.IStockReadOnlyRepository) private stockReadRepository: IStockReadOnlyRepository,
				@inject(TYPES.IUserWriteOnlyRepository) private userWriteRepository: IUserWriteOnlyRepository,
				@inject(TYPES.IUserReadOnlyRepository) private userReadRepository: IUserReadOnlyRepository){}

	public GetGenerateReportUseCase(): IGenerateReportUseCase {
		return new GenerateReportUseCase(this.stockReadRepository, this.userReadRepository, this.userWriteRepository);
	}

	public GetDownloadReportUseCase(): IDownloadReportUseCase {
		return new DownloadReportUseCase(this.userReadRepository);
	}
}