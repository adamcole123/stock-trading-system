import IUserDto from '../data_tranfer_objects/IUserDto';
import IGenerateReportUseCase from './IGenerateReportUseCase';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import { toXML, XmlElement } from 'jstoxml';
import jsonToCsv from 'convert-json-to-csv';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import GainsMode from '../../application/repositories/GainsModes';

export default class GenerateReportUseCase implements IGenerateReportUseCase {
	private stockReadOnlyRepository: IStockReadOnlyRepository;
	private userReadOnlyRepository: IUserReadOnlyRepository;
	private userWriteOnlyRepository: IUserWriteOnlyRepository;
	private tradeReadOnlyRepository: ITradeReadOnlyRepository;

	/**
	 *
	 */
	constructor(_stockReadOnlyRepository: IStockReadOnlyRepository,
				_userReadOnlyRepository: IUserReadOnlyRepository,
				_userWriteOnlyRepository: IUserWriteOnlyRepository,
				_tradeReadOnlyRepository: ITradeReadOnlyRepository) {
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
		this.userReadOnlyRepository = _userReadOnlyRepository;
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
		this.tradeReadOnlyRepository = _tradeReadOnlyRepository;
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
		throw new Error('Method not implemented');
	}
	usersHeldShares(user_id: string, ascending: boolean, report_type: string): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			try {
				let userTransactions = await this.tradeReadOnlyRepository.fetch({user_id: user_id});
				try{
					let numSharesPerCompany: any[] = []
					
					userTransactions.forEach(async trade => {
						let companyIndexInArray = numSharesPerCompany.findIndex(company => company.stock_id === trade.stock_id);
						if(companyIndexInArray === -1){
							numSharesPerCompany.push({
								stock_id: trade.stock_id,
								amount_held: trade.trade_type === "Buy" ? trade.stock_amount : trade.stock_amount! * -1,
							})
						} else {
							numSharesPerCompany[companyIndexInArray].amount_held += trade.trade_type === "Buy" ? trade.stock_amount: trade.stock_amount! * -1
						}
					})
		
					try {
						numSharesPerCompany = numSharesPerCompany.map(async (company) => {
							let stockInfo = await this.stockReadOnlyRepository.fetch({id: company.stock_id});
							let companyInfo = {
								stock_id: company.stock_id,
								amount_held: company.amount_held,
								stock_info: {...stockInfo[0]}
							}
							return companyInfo;
						});
					} catch (error) {
						return reject('Could not add stock information to object: ' + error)
					}
		
		
					try {
						try {
							numSharesPerCompany = ascending ? await numSharesPerCompany.sort((a,b)=> a.stock_info.name-b.stock_info.name):  await numSharesPerCompany.sort((a,b)=> b.stock_info.name-a.stock_info.name);
						} catch (error) {
							reject('Could not sort by company name: ' + error)
						}
			
			
						let columnDef = [...Object.keys(numSharesPerCompany[0])]
			
						let initialValue = "<shares>";
						let newReport = {
							report_date: new Date(),
							report_data: report_type === 'CSV' ? jsonToCsv.convertArrayOfObjects(numSharesPerCompany, columnDef) : numSharesPerCompany.reduce((acc: string, obj: XmlElement | XmlElement[] | undefined) => {return acc + `<company>${toXML(obj)}</company>`}, initialValue) + "</shares>",
							report_type: report_type
						}
			
						let user = await this.userReadOnlyRepository.fetch({id: user_id})
			
						user.reports?.push(newReport);
			
						let userEditted = await this.userWriteOnlyRepository.edit(user.username!, {
							reports: user.reports
						}, {})
			
						resolve(userEditted);
					} catch (error) {
						reject('Could not convert data structures: ' + error);
					}
				} catch (error) {
					reject('Could not get user information: ' + error);
				}
			} catch (error) {
				reject('Cannot get trade information: ' + error);
			}
		})
	}
	
}