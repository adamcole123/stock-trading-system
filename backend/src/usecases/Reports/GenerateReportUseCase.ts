import IUserDto from '../data_tranfer_objects/IUserDto';
import IGenerateReportUseCase from './IGenerateReportUseCase';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import { toXML, XmlElement } from 'jstoxml';
import jsonToCsv from 'convert-json-to-csv';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IStockDto from '../data_tranfer_objects/IStockDto';

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
			report_type = report_type.toUpperCase();
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
							symbol: stock.symbol,
							name: stock.name,
							volume: stock.volume,
							value: stock.value,
							gains: stock.gains,
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

					let userEditted = await this.userWriteOnlyRepository.addReport(user.username!, newReport)
	
					if(userEditted){
						resolve(userEditted);
					}
				} catch (error) {
					reject("Cannot add report to user: " + error);
				}
			} catch (error) {
				reject("Cannot get list of companies: " + error);
			}
		})
	}
	selectedCompanyDetails(user_id: string, ascending: boolean, stock_ids: string[], report_type: string): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			report_type = report_type.toUpperCase();
			try {
				let companyDetails: IStockDto[];
	
				companyDetails = await this.stockReadOnlyRepository.fetch(stock_ids.map(stock_id => { return { id: stock_id }}), { order: { orderBy: 'name', orderDirection: ascending ? 1 : 0 }});

				companyDetails = companyDetails.map(stock => {
					return {
						symbol: stock.symbol,
						name: stock.name,
						volume: stock.volume,
						value: stock.value,
						gains: stock.gains,
					};
				})
				
				let plainStockKeysToRemove: string[] = [];
	
				let plainStockObjs: any = companyDetails.map((company: any) => {
					Object.keys(company).forEach(key => {
						if (company[key] === undefined) {
						  delete company[key];
						  plainStockKeysToRemove.push(key);
						}
					  });

					return {...company}
				});

				plainStockObjs.forEach((_stock: any, _index: any) => {
					plainStockKeysToRemove.forEach(key => {
						delete plainStockObjs[_index][key];
					});
				});
	
				let columnDef = [...Object.keys(plainStockObjs[0])]
			
				let initialValue = "<stocks>";
				let newReport = {
					report_date: new Date(),
					report_data: report_type === 'CSV' ? jsonToCsv.convertArrayOfObjects(plainStockObjs, columnDef) : plainStockObjs.reduce((acc: string, obj: XmlElement | XmlElement[] | undefined) => {return acc + `<stock>${toXML(obj)}</stock>`}, initialValue) + "</stocks>",
					report_type: report_type
				}
				let user = await this.userReadOnlyRepository.fetch({id: user_id})
	
				let userEditted = await this.userWriteOnlyRepository.addReport(user.username!, newReport)
	
				resolve(userEditted);
			} catch (error) {
				reject(error);
			}
		});
	}

	usersHeldShares(user_id: string, ascending: boolean, report_type: string): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			report_type = report_type.toUpperCase();
			this.tradeReadOnlyRepository.fetch({user_id: user_id}, false)
			.then(async trades => {
				let filteredUserTransactions = trades.filter(trade => !(trade.trade_status === "Rejected" || trade.trade_status === "Pending"));
				if(filteredUserTransactions.length < 1) {
					let user = await this.userReadOnlyRepository.fetch({id: user_id})
			
					let newReport = {
						report_date: new Date(),
						report_data:"",
						report_type: report_type
					};
		
					let userEditted = await this.userWriteOnlyRepository.addReport(user.username!, newReport)
					
					return resolve(userEditted);
				}
				let numSharesPerCompany: any[] = await this.groupByCompany(filteredUserTransactions);

				this.addStockInfoToCompany(numSharesPerCompany)
				.then(numSharesWithStocks => {
					numSharesPerCompany = numSharesWithStocks

					this.sortByCompany(numSharesPerCompany, ascending)
					.then(async numSharesSorted => {
						numSharesPerCompany = numSharesSorted

						if(report_type === 'XML'){
							numSharesPerCompany = numSharesPerCompany.map(company => {
								return {
									amount_held: company.amount_held,
									stock_info: company.stock_info
								};
							})
						}

						if(report_type === 'CSV'){
							numSharesPerCompany = numSharesPerCompany.map(company => {
								return {
									amount_held: company.amount_held,
									stock_symbol: company.stock_info.symbol,
									stock_name: company.stock_info.name
								};
							})
						}

						let columnDef = [...Object.keys(numSharesPerCompany[0])]
		
						let initialValue = "<shares>";
						let newReport = {
							report_date: new Date(),
							report_data: report_type === 'CSV' ? jsonToCsv.convertArrayOfObjects(numSharesPerCompany, columnDef) : numSharesPerCompany.reduce((acc: string, obj: XmlElement | XmlElement[] | undefined) => {return acc + `<company>${toXML(obj)}</company>`}, initialValue) + "</shares>",
							report_type: report_type
						}
						let user = await this.userReadOnlyRepository.fetch({id: user_id})
			
						let userEditted = await this.userWriteOnlyRepository.addReport(user.username!, newReport)
			
						resolve(userEditted);
					})
					.catch(err => {
						reject(err);
					})
				})
				.catch(err => {
					reject(err);
				})
				
			})
			.catch(err => {
				reject(err)
			})
		})
	}
	

	private sortByCompany(numSharesPerCompany: any[], ascending: boolean): Promise<any[]> {
		return new Promise((resolve, reject) => {
			let sortedArray = ascending ? numSharesPerCompany.sort(this.dynamicSort("")) : numSharesPerCompany.sort(this.dynamicSort("-"));
			resolve(sortedArray);
		})
	}

	private addStockInfoToCompany(numSharesPerCompany: any[]): Promise<any[]> {
		numSharesPerCompany = numSharesPerCompany.map((company) => {
			return this.stockReadOnlyRepository.fetch({ id: company.stock_id })
			.then(stock => {
				return {
					stock_id: company.stock_id,
					amount_held: company.amount_held,
					stock_info: stock[0]
				};
			});
		});
	
		return Promise.all(numSharesPerCompany).then((companiesArray) => {
			return companiesArray;
		});
	}

	private groupByCompany(trades: ITradeDto[]): Promise<any[]> {
		return new Promise((resolve, reject) => {
			let numSharesPerCompany: any[] = []
	
			trades.forEach(async (trade) => {
				let companyIndexInArray = numSharesPerCompany.findIndex(company => company.stock_id === trade.stock_id?.toString());
				if (companyIndexInArray === -1) {
					numSharesPerCompany.push({
						stock_id: trade.stock_id?.toString(),
						amount_held: trade.trade_type === "Buy" ? trade.stock_amount : trade.stock_amount! * -1,
					});
				} else {
					numSharesPerCompany[companyIndexInArray].amount_held += trade.trade_type === "Buy" ? trade.stock_amount : trade.stock_amount! * -1;
				}
			});

			numSharesPerCompany = numSharesPerCompany.filter(val => val.amount_held > 0);
	
			resolve(numSharesPerCompany)
		})
	}

	private dynamicSort(property: string) {
		var sortOrder = 1;
	
		if(property === "-") {
			sortOrder = -1;
		}
	
		return function (a: any,b: any) {
			if(sortOrder == -1){
				return b['stock_info']['name'].localeCompare(a['stock_info']['name']);
			}else{
				return a['stock_info']['name'].localeCompare(b['stock_info']['name']);
			}        
		}
	}
}