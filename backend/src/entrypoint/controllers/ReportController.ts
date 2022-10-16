import { inject } from "inversify";
import { controller, httpGet, interfaces, request, response } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../../constants/types";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import IGenerateReportUseCase from "../../usecases/Reports/IGenerateReportUseCase";
import ReportServiceLocator from "../../configuration/ReportServiceLocator";
import IDownloadReportUseCase from "src/usecases/Reports/IDownloadReportUseCase";
import { ApiPath } from "swagger-express-ts";
import { ApiOperationGet } from "swagger-express-ts";
import { SwaggerDefinitionConstant } from "swagger-express-ts";

dotenv.config();

@ApiPath({
	name: 'Reports',
	path: '/report',
})
@controller('/report')
export default class ReportController implements interfaces.Controller {
	private readonly generateReportUseCase: IGenerateReportUseCase;
	private readonly downloadReportUseCase: IDownloadReportUseCase;

	constructor(@inject(TYPES.ReportServiceLocator) serviceLocator: ReportServiceLocator) {
		this.generateReportUseCase = serviceLocator.GetGenerateReportUseCase();
		this.downloadReportUseCase = serviceLocator.GetDownloadReportUseCase();
	}

	@ApiOperationGet({
		description: 'Generate company values report',
		path: '/company-values',
		parameters: {
			path: {
				ascending: {
					required: true,
					type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
				},
				reportformat: {
					required: true,
					type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					enum: ['CSV', 'XML']
				},
			},
		},
		responses: {
			200: { description: "Success", model: "User" },
			401: {
				description: "User not authorised"
			},
			500: {
				description: "Internal server error"
			},
		},
	})
	@httpGet('/company-values')
	public async companyValues(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		let ascending: boolean = req.query.ascending === "false" ? false : true;
		let report_type: string = String(req.query.reportformat);
		let cookieData = await <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);

		if (!cookieData.id) {
			return res.status(401).json({ error: 'User not authorised' });
		}

		return await this.generateReportUseCase.completeStockValues(cookieData.id!, ascending, report_type)
			.then((userDto: IUserDto) => {
				res.status(200).json(userDto)
			})
			.catch((err: Error) => {
				console.log(err);
				res.status(500).json(err);
			});
	}

	@ApiOperationGet({
		description: 'Generate users held shares report',
		path: '/held-shares',
		parameters: {
			path: {
				ascending: {
					required: true,
					type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
				},
				reportformat: {
					required: true,
					type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					enum: ['CSV', 'XML']
				}
			},
		},
		responses: {
			200: { description: "Success", model: "User" },
			401: {
				description: "User not authorised"
			},
			500: {
				description: "Internal server error"
			},
		},
	})
	@httpGet('/held-shares')
	public async userHeldShares(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		let ascending: boolean = req.query.ascending === "false" ? false : true;
		let report_type: string = String(req.query.reportformat);
		let cookieData = await <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);

		if (!cookieData.id) {
			return res.status(401).json({ error: 'User not authorised' });
		}

		return await this.generateReportUseCase.usersHeldShares(cookieData.id!, ascending, report_type)
			.then((userDto: IUserDto) => {
				res.status(200).json(userDto)
			})
			.catch((err: Error) => {
				console.log(err)
				res.status(500).json(err);
			});
	}

	@ApiOperationGet({
		description: 'Generate details of selected companies report',
		path: '/company-details',
		parameters: {
			path: {
				ascending: {
					required: true,
					type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
				},
				reportformat: {
					required: true,
					type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					enum: ['CSV', 'XML']
				},
				stockids: {
					required: true,
					type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
					itemType: SwaggerDefinitionConstant.Parameter.Type.STRING,
				},
			},
		},
		responses: {
			200: { description: "Success", model: "User" },
			401: {
				description: "User not authorised"
			},
			500: {
				description: "Internal server error"
			},
		},
	})
	@httpGet('/company-details')
	public async companyDetails(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		let stock_ids = <string[]>req.query.stockids;
		let ascending: boolean = req.query.ascending === "false" ? false : true;
		let report_type: string = String(req.query.reportformat);
		let cookieData = await <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);

		if (!cookieData.id) {
			return res.status(401).json({ error: 'User not authorised' });
		}

		if (!stock_ids) {
			return res.status(500).json('No stocks were selected for the report');
		}

		return await this.generateReportUseCase.selectedCompanyDetails(cookieData.id!, ascending, stock_ids, report_type)
			.then((userDto: IUserDto) => {
				res.status(200).json(userDto)
			})
			.catch((err: Error) => {
				console.log(err)
				res.status(500).json(err);
			});
	}

	@ApiOperationGet({
		description: 'Download user generated report',
		path: '/download',
		parameters: {
			path: {
				report_id: {
					required: true,
					type: SwaggerDefinitionConstant.Parameter.Type.STRING,
				},
				user_id: {
					required: true,
					type: SwaggerDefinitionConstant.Parameter.Type.STRING,
				}
			},
		},
		responses: {
			200: { description: "Success" },
			401: {
				description: "User not authorised"
			},
			500: {
				description: "Internal server error"
			},
		},
	})
	@httpGet('/download')
	public async download(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		let cookieData = await <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);

		if (cookieData.id !== req.query.user_id) {
			return res.status(401).json({ error: 'User not authorised' });
		}

		return await this.downloadReportUseCase.invoke(String(req.query.report_id), String(req.query.user_id))
			.then(([filename, filedata, contenttype]: [string, string, string]) => {
				res.attachment(filename);
				res.send(filedata);
			})
			.catch((err: Error) => {
				console.log(err);
				res.status(500).json(err);
			});
	}
}