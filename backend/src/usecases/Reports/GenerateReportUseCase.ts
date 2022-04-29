import IUserDto from '../data_tranfer_objects/IUserDto';
import IGenerateReportUseCase from './IGenerateReportUseCase';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import ReportType from '../entities/ReportType';
import jsonToCsv from 'convert-json-to-csv';
import { toXML } from 'jstoxml';

export default class GenerateReportUseCase implements IGenerateReportUseCase {
	private stockReadOnlyRepository: IStockReadOnlyRepository;
	private userReadOnlyRepository: IUserReadOnlyRepository;
	private userWriteOnlyRepository: IUserWriteOnlyRepository;

	/**
	 *
	 */
	constructor(_stockReadOnlyRepository: IStockReadOnlyRepository,
				_userReadOnlyRepository: IUserReadOnlyRepository,
				_userWriteOnlyRepository: IUserWriteOnlyRepository) {
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
		this.userReadOnlyRepository = _userReadOnlyRepository;
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
	}

	async completeStockValues(user_id: string, ascending: boolean, report_type: ReportType): Promise<IUserDto> {
		try{
			let stocks = await this.stockReadOnlyRepository.fetch({}, {
				order: {
					orderBy: 'value',
					orderDirection: ascending? 1 : 0
				}
			})

			try{
				let user = await this.userReadOnlyRepository.fetch({id: user_id})

				let plainStockObjs = stocks.map(stock => {
					return {...stock};
				})

				let columnDef = [{...Object.keys(stocks[0])}]

				user.reports?.push({
					report_date: new Date(),
					report_data: report_type === ReportType.CSV ? jsonToCsv.convertArrayOfObjects(stocks, columnDef[0]) : toXML(plainStockObjs),
					report_type: report_type
				})

				let userEditted = await this.userWriteOnlyRepository.edit(user.username!, {
					reports: user.reports
				}, {})

				return userEditted;
			} catch (error) {
				throw new Error("Cannot add report to user: " + error);
			}
		} catch (error) {
			throw new Error("Cannot get list of companies: " + error);
		}
	}
	selectedCompanyDetails(user_id: string, stock_ids: string[]): Promise<IUserDto> {
		throw new Error('Method not implemented.');
	}
	usersHeldShares(user_id: string): Promise<IUserDto> {
		throw new Error('Method not implemented.');
	}
	
}