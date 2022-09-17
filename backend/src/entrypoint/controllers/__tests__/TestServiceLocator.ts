import { injectable, inject } from "inversify";
import { mock, objectContainsValue } from "vitest-mock-extended";
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
import ICreateStockUseCase from '../../../usecases/Stocks/ICreateStockUseCase';
import IGetAllStocksUseCase from '../../../usecases/Stocks/IGetAllStocksUseCase';
import IGetOneStockUseCase from "../../../usecases/Stocks/IGetOneStockUseCase";
import IEditStockUseCase from '../../../usecases/Stocks/IEditStockUseCase';
import IGetLastPageNumUseCase from '../../../usecases/Stocks/IGetLastPageNumUseCase';
import IBuyStocksUseCase from '../../../usecases/Trades/IBuyStocksUseCase';
import ISellStocksUseCase from '../../../usecases/Trades/ISellStocksUseCase';
import IGetUserTransactionHistory from '../../../usecases/Trades/IGetUserTransactionHistoryUseCase';
import IGetUserTransactionHistoryUseCase from "../../../usecases/Trades/IGetUserTransactionHistoryUseCase";
import IApproveTradeUseCase from '../../../usecases/Trades/IApproveTradeUseCase';
import IRejectTradeUseCase from '../../../usecases/Trades/IRejectTradeUseCase';
import IGetUserTransactionsByStatusUseCase from '../../../usecases/Trades/IGetUserTransactionsByStatusUseCase';
import IStockTradesForUserUseCase from '../../../usecases/Trades/IStockTradesForUserUseCase';
import IGetUserPortfolioUseCase from '../../../usecases/Trades/IGetUserPortfolioUseCase';
import IUserRegisterUseCase from '../../../usecases/Users/IUserRegisterUseCase';
import IUserSignInUseCase from '../../../usecases/Users/IUserSignInUseCase';
import IValidateUserTokenUseCase from '../../../usecases/Users/IValidateUserTokenUseCase';
import IEditUserDetailsUseCase from '../../../usecases/Users/IEditUserDetailsUseCase';
import IAddNewCreditCardUseCase from '../../../usecases/Users/IAddNewCreditCardUseCase';
import IActivateUserAccountUseCase from '../../../usecases/Users/IActivateUserAccountUseCase';
import IGetAllUsersUseCase from '../../../usecases/Users/IGetAllUsersUseCase';
import IGetUserDetailsUseCase from '../../../usecases/Users/IGetUserDetailsUseCase';
import IPasswordResetUseCase from '../../../usecases/Users/IPasswordResetUseCase';
import ValidateUserTokenUseCase from '../../../usecases/Users/ValidateUserTokenUseCase';
import Encrypter from '../../../infrastructure/Encrypter';
import ISendEmailUseCase from '../../../usecases/Email/ISendEmailUseCase';

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

	public GetCreateStockUseCase(): ICreateStockUseCase {
		let createStockUseCase: ICreateStockUseCase = mock<ICreateStockUseCase>();
		mock(createStockUseCase).invoke.mockRejectedValue(new Error('Could not create stock'));
		return createStockUseCase;
	}

	public GetGetAllStocksUseCase(): IGetAllStocksUseCase {
		let getAllStocksUseCase: IGetAllStocksUseCase = mock<IGetAllStocksUseCase>();
		mock(getAllStocksUseCase).invoke.mockRejectedValue(new Error('Could not get all stocks'));
		return getAllStocksUseCase;
	}

	public GetGetOneStockUseCase(): IGetOneStockUseCase {
		let getOneStockUseCase: IGetOneStockUseCase = mock<IGetOneStockUseCase>();
		mock(getOneStockUseCase).invoke.mockRejectedValue(new Error('Could not get stock'));
		return getOneStockUseCase;
	}

	public GetEditStockUseCase(): IEditStockUseCase {
		let editStockUseCase: IEditStockUseCase = mock<IEditStockUseCase>();
		mock(editStockUseCase).invoke.mockRejectedValue(new Error('Could not edit stock'));
		return editStockUseCase;
	}

	public GetGetLastPageNumUseCase(): IGetLastPageNumUseCase {
		let getLastPageNumUseCase: IGetLastPageNumUseCase = mock<IGetLastPageNumUseCase>();
		mock(getLastPageNumUseCase).invoke.mockRejectedValue(new Error('Could not get last page number'));
		return getLastPageNumUseCase;
	}

	public GetBuyStocksUseCase(): IBuyStocksUseCase {
		let buyStocksUseCase: IBuyStocksUseCase = mock<IBuyStocksUseCase>();
		mock(buyStocksUseCase).invoke.mockRejectedValue(new Error('Could not buy stocks'));
		return buyStocksUseCase;
	}
	public GetSellStocksUseCase(): ISellStocksUseCase {
		let sellStocksUseCase: ISellStocksUseCase = mock<ISellStocksUseCase>();
		mock(sellStocksUseCase).invoke.mockRejectedValue(new Error('Could not sell stocks'));
		return sellStocksUseCase;
	}
	public GetGetUserTransactionHistoryUseCase(): IGetUserTransactionHistoryUseCase {
		let getUserTransactionHistoryUseCase: IGetUserTransactionHistoryUseCase = mock<IGetUserTransactionHistoryUseCase>();
		mock(getUserTransactionHistoryUseCase).invoke.mockRejectedValue(new Error('Could not get user transaction history'));
		return getUserTransactionHistoryUseCase;
	}
	public GetApproveTradeUseCase(): IApproveTradeUseCase {
		let approveTradeUseCase: IApproveTradeUseCase = mock<IApproveTradeUseCase>();
		mock(approveTradeUseCase).invoke.mockRejectedValue(new Error('Could not approve trade'));
		return approveTradeUseCase;
	}
	public GetRejectTradeUseCase(): IRejectTradeUseCase {
		let rejectTradeUseCase: IRejectTradeUseCase = mock<IRejectTradeUseCase>();
		mock(rejectTradeUseCase).invoke.mockRejectedValue(new Error('Could not reject trade'));
		return rejectTradeUseCase;
	}
	public GetGetUserTransactionsByStatusUseCase(): IGetUserTransactionsByStatusUseCase {
		let getUserTransactionsByStatusUseCase: IGetUserTransactionsByStatusUseCase = mock<IGetUserTransactionsByStatusUseCase>();
		mock(getUserTransactionsByStatusUseCase).invoke.mockRejectedValue(new Error('Could not get user transactions by status'));
		return getUserTransactionsByStatusUseCase;
	}
	public GetStockTradesForUserUseCase(): IStockTradesForUserUseCase {
		let stockTradesForUserUseCase: IStockTradesForUserUseCase = mock<IStockTradesForUserUseCase>();
		mock(stockTradesForUserUseCase).invoke.mockRejectedValue(new Error('Could not get stock trades for user'));
		return stockTradesForUserUseCase;
	}
	public GetGetUserPortfolioUseCase(): IGetUserPortfolioUseCase {
		let getUserPortfolioUseCase: IGetUserPortfolioUseCase = mock<IGetUserPortfolioUseCase>();
		mock(getUserPortfolioUseCase).invoke.mockRejectedValue(new Error('Could not get user portfolio'));
		return getUserPortfolioUseCase;
	}
	public GetUserRegisterUseCase(): IUserRegisterUseCase {
		let userRegisterUseCase: IUserRegisterUseCase = mock<IUserRegisterUseCase>();
		mock(userRegisterUseCase).invoke.mockRejectedValue(new Error('Could not register user'));
		return userRegisterUseCase;
	}

	public GetUserSignInUseCase(): IUserSignInUseCase {
		let userSignInUseCase: IUserSignInUseCase = mock<IUserSignInUseCase>();
		mock(userSignInUseCase).invoke.mockRejectedValue(new Error('Could not sign in user'));
		return userSignInUseCase;
	}

	public GetValidateUserTokenUseCase(): IValidateUserTokenUseCase {
		let userReadOnlyRepository: IUserReadOnlyRepository = mock<IUserReadOnlyRepository>();
		mock(userReadOnlyRepository).fetch.calledWith(objectContainsValue('testadmin')).mockResolvedValue({
			username: "test1username",
			email: "test1email",
			firstName: "test1firstname",
			lastName: "test1lastname",
			birthDate: new Date('0'),
			reports: [],
			id: "testadmin",
			password: 'testpassword',
			credit: 50000,
			role: "Admin",
			isDeleted: false,
			cardDetails: [],
			activationDate: new Date('0'),
			banUntil: new Date('0')
		});
		mock(userReadOnlyRepository).fetch.calledWith(objectContainsValue('testbroker')).mockResolvedValue({
			username: "test1username",
			email: "test1email",
			firstName: "test1firstname",
			lastName: "test1lastname",
			birthDate: new Date('0'),
			reports: [],
			id: "testbroker",
			password: 'testpassword',
			credit: 50000,
			role: "Broker",
			isDeleted: false,
			cardDetails: [],
			activationDate: new Date('0'),
			banUntil: new Date('0')
		});
		mock(userReadOnlyRepository).fetch.calledWith(objectContainsValue('testuser')).mockResolvedValue({
			username: "test1username",
			email: "test1email",
			firstName: "test1firstname",
			lastName: "test1lastname",
			birthDate: new Date('0'),
			reports: [],
			id: "testuser",
			password: 'testpassword',
			credit: 50000,
			role: "User",
			isDeleted: false,
			cardDetails: [],
			activationDate: new Date('0'),
			banUntil: new Date('0')
		});
		mock(userReadOnlyRepository).fetch.calledWith(objectContainsValue('testerror')).mockRejectedValue(new Error('Could not get user'));
		return new ValidateUserTokenUseCase(userReadOnlyRepository, new Encrypter());
	}

	public GetEditUserDetailsUseCase(): IEditUserDetailsUseCase {
		let editUserDetailsUseCase: IEditUserDetailsUseCase = mock<IEditUserDetailsUseCase>();
		mock(editUserDetailsUseCase).invoke.mockRejectedValue(new Error('Could not edit user'));
		return editUserDetailsUseCase;
	}

	public GetAddNewCreditCardUseCase(): IAddNewCreditCardUseCase {
		let addNewCreditCardUseCase: IAddNewCreditCardUseCase = mock<IAddNewCreditCardUseCase>();
		mock(addNewCreditCardUseCase).invoke.mockRejectedValue(new Error('Could not add new credit card'));
		return addNewCreditCardUseCase;
	}
	
	public GetActivateUserAccountUseCase(): IActivateUserAccountUseCase {
		let activateUserAccountUseCase: IActivateUserAccountUseCase = mock<IActivateUserAccountUseCase>();
		mock(activateUserAccountUseCase).invoke.mockRejectedValue(new Error('Could not activate user account'));
		return activateUserAccountUseCase;
	}

	public GetGetAllUsersUseCase(): IGetAllUsersUseCase {
		let getAllUsersUseCase: IGetAllUsersUseCase = mock<IGetAllUsersUseCase>();
		mock(getAllUsersUseCase).invoke.mockRejectedValue(new Error('Could not get all users'));
		return getAllUsersUseCase;
	}

	public GetGetUserDetailsUseCase(): IGetUserDetailsUseCase {
		let getUserDetailsUseCase: IGetUserDetailsUseCase = mock<IGetUserDetailsUseCase>();
		mock(getUserDetailsUseCase).invoke.mockRejectedValue(new Error('Could not get user details'));
		return getUserDetailsUseCase;
	}

	public GetPasswordResetUseCase(): IPasswordResetUseCase {
		let passwordResetUseCase: IPasswordResetUseCase = mock<IPasswordResetUseCase>();
		mock(passwordResetUseCase).invoke.mockRejectedValue(new Error('Could not reset password'));
		return passwordResetUseCase;
	}

	public GetSendEmailUseCase(): ISendEmailUseCase {
		let sendEmailUseCase: ISendEmailUseCase = mock<ISendEmailUseCase>();
		mock(sendEmailUseCase).invoke.mockResolvedValue({
			to: ['test'],
			from: 'test',
			subject: 'Test',
			bodyHtml: 'Test',
			bodyText: 'Test'
		});
		return sendEmailUseCase;
	}
}