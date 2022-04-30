import IUserReadOnlyRepository from 'src/application/repositories/IUserReadOnlyRepository';
import IReportDto from '../data_tranfer_objects/IReportDto';
import IDownloadReportUseCase from './IDownloadReportUseCase';
import moment from 'moment';

export default class DownloadReportUseCase implements IDownloadReportUseCase {
	private userReadOnlyRepository: IUserReadOnlyRepository;

	/**
	 *
	 */
	constructor(_userReadOnlyRepository: IUserReadOnlyRepository) {
		this.userReadOnlyRepository = _userReadOnlyRepository;
	}

	invoke(report_id: string, user_id: string): Promise<[string, string, string]> {
		return new Promise(async (resolve, reject) => {
			try {
				let user = await this.userReadOnlyRepository.fetch({id: user_id})

				let reportObj = user.reports?.find(report => report.id === report_id);
		
				if(reportObj)
					return resolve([`new_report.${reportObj.report_type?.toLowerCase()}`, reportObj.report_data!, `text/${reportObj.report_type?.toLowerCase()}`]);
					// return resolve([`${moment(reportObj.report_date).format("MMMM Do YYYY, h:mm:ss a")}.${reportObj.report_type?.toLowerCase()}`, reportObj.report_data!]);

				throw new Error('Report not found');
			} catch (error) {
				return reject("Could not get report: " + error);
			}
		})
	}
	
}