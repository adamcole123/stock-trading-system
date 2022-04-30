import { inject } from "inversify";
import { controller, httpGet, interfaces, request, response } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../../constants/types";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import IGenerateReportUseCase from "../../usecases/Reports/IGenerateReportUseCase";
import ReportServiceLocator from "../../configuration/ReportServiceLocator";

dotenv.config();

@controller('/report')
export default class ReportController implements interfaces.Controller {
	private readonly generateReportUseCase: IGenerateReportUseCase;
	
	constructor(@inject(TYPES.ReportServiceLocator) serviceLocator: ReportServiceLocator){
		this.generateReportUseCase = serviceLocator.GetGenerateReportUseCase();
	}

	@httpGet('/company-values')
	public async userTransactions(@request() req: express.Request, @response() res: express.Response){
		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		let ascending: any = req.query.ascending;
		let report_type: any = req.query.report_type;
		let cookieData = await <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);
			
		if(!cookieData.id){
			return res.status(401).json({error: 'User not authorised'});
		}
		
		return await this.generateReportUseCase.completeStockValues(cookieData.id!, ascending, report_type)
			.then((userDto: IUserDto) => {
				res.status(200).json(userDto)
			})
			.catch((err: Error) => {
				res.status(500).json(err);
			});
	}
}