import ReportType from "./ReportType";

export default interface Report {
  id: string;
  report_data: string;
  report_type: ReportType;
}
