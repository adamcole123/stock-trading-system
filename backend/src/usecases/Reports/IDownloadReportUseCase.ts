import IReportDto from '../data_tranfer_objects/IReportDto';
import IUserReadOnlyRepository from 'src/application/repositories/IUserReadOnlyRepository';

export default interface IDownloadReportUseCase {
	invoke(report_id: string, user_id: string): Promise<[string, string, string]>;
}