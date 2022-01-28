import ReportType from "./ReportType";

export default class Report {
	constructor (
		public id: string,
		public report_data: string,
		public report_type: ReportType
	) {

	}
}