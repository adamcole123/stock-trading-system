import IUserDto from '../data_tranfer_objects/IUserDto';
import IGenerateReportUseCase from './IGenerateReportUseCase';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import { toXML, XmlElement } from 'jstoxml';
import jsonToCsv from 'convert-json-to-csv';

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

	completeStockValues(user_id: string, ascending: boolean, report_type: string): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			try{
				let stocks = await this.stockReadOnlyRepository.fetch({}, {
					order: {
						orderBy: 'value',
						orderDirection: ascending? 1 : 0
					}
				})
	
				try{
					let user = await this.userReadOnlyRepository.fetch({id: user_id})
	
					stocks = stocks.map(stock => {
						return {
							id: stock.id,
							volume: stock.volume,
							value: stock.value,
							name: stock.name,
							gains: stock.gains,
							open: stock.open,
							close: stock.close,
							symbol: stock.symbol,
						};
					})
	
					let plainStockObjs: any = stocks.map(stock => {
						return {...stock}
					})
					
					plainStockObjs = plainStockObjs.map((stock: { [x: string]: any; }) => {
						Object.keys(stock).forEach(key => stock[key] === undefined && delete stock[key]);
						return {...stock};
					});
	
					let columnDef = [...Object.keys(plainStockObjs[0])]
	
					let initialValue = "<stocks>";
					let newReport = {
						report_date: new Date(),
						report_data: report_type === 'CSV' ? jsonToCsv.convertArrayOfObjects(plainStockObjs, columnDef) : plainStockObjs.reduce((acc: string, obj: XmlElement | XmlElement[] | undefined) => {return acc + `<stock>${toXML(obj)}</stock>`}, initialValue) + "</stocks>",
						report_type: report_type
					}
	
					user.reports?.push(newReport);
	
					let userEditted = await this.userWriteOnlyRepository.edit(user.username!, {
						reports: user.reports
					}, {})
	
					resolve(userEditted);
				} catch (error) {
					reject("Cannot add report to user: " + error);
				}
			} catch (error) {
				reject("Cannot get list of companies: " + error);
			}
		})
	}
	selectedCompanyDetails(user_id: string, stock_ids: string[]): Promise<IUserDto> {
		throw new Error('Method not implemented.');
	}
	usersHeldShares(user_id: string): Promise<IUserDto> {
		throw new Error('Method not implemented.');
	}
	
}