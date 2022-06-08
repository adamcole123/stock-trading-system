import { injectable, inject } from "inversify";
import { mock } from "jest-mock-extended";
import IStockReadOnlyRepository from "src/application/repositories/IStockReadOnlyRepository";
import IStockWriteOnlyRepository from "src/application/repositories/IStockWriteOnlyRepository";
import ITradeReadOnlyRepository from "src/application/repositories/ITradeReadOnlyRepository";
import ITradeWriteOnlyRepository from "src/application/repositories/ITradeWriteOnlyRepository";
import IUserReadOnlyRepository from "src/application/repositories/IUserReadOnlyRepository";
import IUserWriteOnlyRepository from "src/application/repositories/IUserWriteOnlyRepository";
import { TYPES } from "../../../../src/constants/types";
import IDownloadReportUseCase from "src/usecases/Reports/IDownloadReportUseCase";
import IGenerateReportUseCase from "src/usecases/Reports/IGenerateReportUseCase";
import GenerateReportUseCase from './../../../usecases/Reports/GenerateReportUseCase';

@injectable()
export default class TestServiceLocator {
	constructor(@inject(TYPES.IStockReadOnlyRepository) private stockReadRepository: IStockReadOnlyRepository,
				@inject(TYPES.IStockWriteOnlyRepository) private stockWriteRepository: IStockWriteOnlyRepository,
				@inject(TYPES.IUserWriteOnlyRepository) private userWriteRepository: IUserWriteOnlyRepository,
				@inject(TYPES.IUserReadOnlyRepository) private userReadRepository: IUserReadOnlyRepository,
				@inject(TYPES.ITradeReadOnlyRepository) private tradeReadRepository: ITradeReadOnlyRepository,
				@inject(TYPES.ITradeWriteOnlyRepository) private tradeWriteRepository: ITradeWriteOnlyRepository){}

	public GetGenerateReportUseCase(): IGenerateReportUseCase {
		let generateReportUseCase: IGenerateReportUseCase = mock<IGenerateReportUseCase>();
		mock(generateReportUseCase).completeStockValues.mockRejectedValue(new Error('Could not generate report'));
		mock(generateReportUseCase).selectedCompanyDetails.mockRejectedValue(new Error('Could not generate report'));
		mock(generateReportUseCase).usersHeldShares.mockRejectedValue(new Error('Could not generate report'));
		return generateReportUseCase;
	}

	public GetDownloadReportUseCase(): IDownloadReportUseCase {
		let downloadReportUseCase: IDownloadReportUseCase = mock<IDownloadReportUseCase>();
		mock(downloadReportUseCase).invoke.mockRejectedValue(new Error('Could not get report data'));
		return downloadReportUseCase;
	}
}