import IUserDto from '../data_tranfer_objects/IUserDto';
import ReportType from '../entities/ReportType';

export default interface IGenerateReportUseCase{
	completeStockValues(user_id: string, ascending: boolean, report_type: string): Promise<IUserDto>
	selectedCompanyDetails(user_id: string, ascending: boolean, stock_ids: string[], report_type: string): Promise<IUserDto>
	usersHeldShares(user_id: string, ascending: boolean, report_type: string): Promise<IUserDto>
}