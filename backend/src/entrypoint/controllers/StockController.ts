import { inject } from "inversify";
import { controller, httpGet, httpPost, interfaces, request, response } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../../constants/types";
import dotenv from 'dotenv';
import ICreateStockUseCase from '../../usecases/Stocks/ICreateStockUseCase';
import IGetAllStocksUseCase from "../../usecases/Stocks/IGetAllStocksUseCase";
import IGetOneStockUseCase from "../../usecases/Stocks/IGetOneStockUseCase";
import StockServiceLocator from "../../configuration/StockServiceLocator";
import IStockDto from '../../usecases/data_tranfer_objects/IStockDto';
import StockReadOptions from '../../application/repositories/StockReadOptions';
import IEditStockUseCase from "../../usecases/Stocks/IEditStockUseCase";
import IUserDto from "src/usecases/data_tranfer_objects/IUserDto";
import jwt from 'jsonwebtoken';
import UserServiceLocator from '../../configuration/UserServiceLocator';
import IValidateUserTokenUseCase from '../../usecases/Users/IValidateUserTokenUseCase';
import IGetLastPageNumUseCase from "../../usecases/Stocks/IGetLastPageNumUseCase";
import { ApiPath } from "swagger-express-ts";
import { ApiOperationGet } from "swagger-express-ts";
import { SwaggerDefinitionConstant } from "swagger-express-ts";
import { ApiOperationPost } from "swagger-express-ts";

dotenv.config();

@ApiPath({
	name: 'Stocks',
	path: '/stock',
})
@controller('/stock')
export default class StockController implements interfaces.Controller {
	private readonly createStockUseCase: ICreateStockUseCase;
	private readonly getAllStocksUseCase: IGetAllStocksUseCase;
	private readonly getOneStockUseCase: IGetOneStockUseCase;
	private readonly editStockUseCase: IEditStockUseCase;
	private readonly getLastPageNumUseCase: IGetLastPageNumUseCase;
	private readonly validateUserTokenUseCase: IValidateUserTokenUseCase;

	constructor(@inject(TYPES.StockServiceLocator) serviceLocator: StockServiceLocator,
		@inject(TYPES.UserServiceLocator) userServiceLocator: UserServiceLocator) {
		this.createStockUseCase = serviceLocator.GetCreateStockUseCase();
		this.getAllStocksUseCase = serviceLocator.GetGetAllStocksUseCase();
		this.getOneStockUseCase = serviceLocator.GetGetOneStockUseCase();
		this.editStockUseCase = serviceLocator.GetEditStockUseCase();
		this.getLastPageNumUseCase = serviceLocator.GetGetLastPageNumUseCase();
		this.validateUserTokenUseCase = userServiceLocator.GetValidateUserTokenUseCase();
	}

	@ApiOperationGet({
		description: 'Get the details of one stock',
		path: '/getOne',
		parameters: {
			query: {
				symbol: {
					required: false,
					type: SwaggerDefinitionConstant.Parameter.Type.STRING,
				},
				id: {
					required: false,
					type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					enum: ['CSV', 'XML']
				},
			},
		},
		responses: {
			200: { description: "Success", model: "Stock" },
			400: { description: "Resource not found" },
			500: {
				description: "Internal server error"
			},
		},
	})
	@httpGet('/getOne')
	public async getStock(@request() req: express.Request, @response() res: express.Response) {

		if (!req.query.id && !req.query.symbol) {
			return res.status(400).json({ error: 'No stock ID or symbol provided' });
		}

		let reqStock: IStockDto = req.query;

		return await this.getOneStockUseCase.invoke(reqStock)
			.then((stockDto: IStockDto) => {
				res.status(200).json(stockDto)
			})
			.catch((err: Error) => res.status(500).json(err));

	}

	@ApiOperationGet({
		description: 'Get the number of the last page in the stocks list based on the limit set by the user',
		path: '/lastpagenum',
		parameters: {
			query: {
				limit: {
					required: false,
					type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
				},
			},
		},
		responses: {
			200: { description: "Success", type: SwaggerDefinitionConstant.Parameter.Type.NUMBER },
			400: { description: "Resource not found" },
			500: {
				description: "Internal server error"
			},
		},
	})
	@httpGet('/lastpagenum')
	public async lastPageNum(@request() req: express.Request, @response() res: express.Response) {
		return await this.getLastPageNumUseCase.invoke(Number(req.query.limit))
			.then((lastPage: number) => {
				res.status(200).json(lastPage)
			})
			.catch((err: Error) => res.status(500).json(err));
	}

	@ApiOperationPost({
		description: 'Get the details of many stocks',
		path: '/getMany',
		parameters: {
			body: {
				properties: {
					filters: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.OBJECT,
					},
					options: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.OBJECT,
					}
				}
			},
		},
		responses: {
			200: { description: "Success", model: "Stock" },
			500: {
				description: "Internal server error"
			},
		},
	})
	@httpPost('/getMany')
	public async getStocks(@request() req: express.Request, @response() res: express.Response) {
		if (req.body.filters !== undefined) {
			if (req.body.filters.volume === undefined) {
				req.body.filters.volume = 0;
				req.body.options.volumeMode = 2;
			} else {
				req.body.filters.volume = Number(req.body.filters.volume);
				if (req.body.options.volumeMode !== undefined) {
					req.body.options.volumeMode = Number(req.body.options.volumeMode);
				}
			}
			if (req.body.filters.value === undefined) {
				delete req.body.options.valueMode;
			} else {
				req.body.filters.value = Number(req.body.filters.value);
				if (req.body.options.valueMode !== undefined) {
					req.body.options.valueMode = Number(req.body.options.valueMode);
				}
			}
			if (req.body.filters.gains === undefined) {
				delete req.body.options.gainsMode;
			} else {
				req.body.filters.gains = Number(req.body.filters.gains);
				if (req.body.options.gainsMode !== undefined) {
					req.body.options.gainsMode = Number(req.body.options.gainsMode);
				}
			}
		}

		if (req.body.options !== undefined) {
			if (req.body.options.order !== undefined) {
				if (req.body.options.order.orderDirection !== undefined)
					req.body.options.order.orderDirection = Number(req.body.options.order.orderDirection);
			}
		}


		return await this.getAllStocksUseCase.invoke(req.body.filters, req.body.options)
			.then((stockDto: IStockDto[]) => {
				res.status(200).json(stockDto)
			})
			.catch((err: Error) => res.status(500).json(err));
	}

	@ApiOperationPost({
		description: 'Create a new stock',
		path: '/create',
		parameters: {
			body: {
				model: "Stock"
			},
		},
		responses: {
			200: { description: "Success", type: SwaggerDefinitionConstant.Parameter.Type.NUMBER },
			400: { description: "Must provide criteria or options" },
			401: { description: "Only an admin can add companies." },
			500: {
				description: "Internal server error"
			},
		},
	})
	@httpPost('/create')
	public async createStock(@request() req: express.Request, @response() res: express.Response) {
		let verified = await this.validateUserTokenUseCase.invoke(req.cookies.token);

		if (verified.role !== 'Admin') {
			return res.status(401).json('Only an admin can add companies.');
		}

		if (Object.keys(req.body).length < 1 && req.body.options === undefined) {
			return res.status(400).json({ error: 'Must provide criteria or options' });
		}

		return await this.createStockUseCase.invoke(req.body)
			.then((stockDto: IStockDto) => {
				res.status(200).json(stockDto)
			})
			.catch((err: Error) => res.status(500).json(err));
	}

	@ApiOperationPost({
		description: 'Edit an existing stock',
		path: '/edit',
		parameters: {
			body: {
				model: "Stock"
			},
		},
		responses: {
			200: { description: "Success", type: SwaggerDefinitionConstant.Parameter.Type.NUMBER },
			400: { description: "Must provide data to edit stock." },
			500: {
				description: "Internal server error"
			},
		},
	})
	@httpPost('/edit')
	public async editStock(@request() req: express.Request, @response() res: express.Response) {

		if (Object.keys(req.body).length < 1) {
			return res.status(400).json({ error: 'Must provide data to edit stock.' });
		}

		return await this.editStockUseCase.invoke(req.body)
			.then((stockDto: IStockDto[]) => {
				res.status(200).json(stockDto[0])
			})
			.catch((err: Error) => res.status(500).json(err));
	}
}