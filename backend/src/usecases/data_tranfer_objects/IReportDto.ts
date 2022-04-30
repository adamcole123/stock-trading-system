import ReportType from "../entities/ReportType";

export default interface IReportDto {
	id?: string;
	report_data?: string;
	report_type?: ReportType;
	report_date?: Date;
}