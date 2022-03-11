import { inject } from "inversify";
import { controller, httpGet, httpPost, interfaces, request, response } from "inversify-express-utils";
import * as express from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserServiceLocator from "../../configuration/UserServiceLocator";
import { TYPES } from "../../constants/types";
import IUserDto from "../../usecases/data_tranfer_objects/IUserDto";
import IUserRegisterUseCase from "../../usecases/Users/IUserRegisterUseCase";
import IUserSignInUseCase from "../../usecases/Users/IUserSignInUseCase";
import IValidateUserTokenUseCase from "../../usecases/Users/IValidateUserTokenUseCase";

@controller('/user')
export default class UserController implements interfaces.Controller {
	private readonly userSignInUseCase: IUserSignInUseCase;
	private readonly userRegisterUseCase: IUserRegisterUseCase;
	private readonly validateUserTokenUseCase: IValidateUserTokenUseCase;
	
	constructor(@inject(TYPES.UserServiceLocator) serviceLocator: UserServiceLocator){
		this.userSignInUseCase = serviceLocator.GetUserSignInUseCase();
		this.userRegisterUseCase = serviceLocator.GetUserRegisterUseCase();
		this.validateUserTokenUseCase = serviceLocator.GetValidateUserTokenUseCase();
	}
	
	@httpPost('/signin')
	public async signInUser(@request() req: express.Request, @response() res: express.Response){
		let reqUser: IUserDto = req.body;

		return this.userSignInUseCase.invoke(reqUser)
			.then((signedInUserDto: IUserDto) => {
				let jwtSecretKey = process.env.JWT_SECRET_KEY;
			
				const token = jwt.sign(signedInUserDto, jwtSecretKey!);

				res.status(200).json(token)
			})
			.catch((err: Error) => res.status(400).json({error: err.message}));
	}

	@httpPost('/register')
	public async registerUser(@request() req: express.Request, @response() res: express.Response){
		let newUser: IUserDto = {
			username: req.body.username,
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
    		password: req.body.password,
		}

		return this.userRegisterUseCase.invoke(newUser)
			.then((registeredUserDto: IUserDto) => {
				let jwtSecretKey = process.env.JWT_SECRET_KEY;
			
				const token = jwt.sign(registeredUserDto, jwtSecretKey!);

				res.status(200).json(token)
			})
			.catch((err: Error) => res.status(400).json({error: err.message}));
	}

	@httpGet('/validate')
	public async validateUser(@request() req: express.Request, @response() res: express.Response){
		return this.validateUserTokenUseCase.invoke(req.body.token)
			.then((validated: string | JwtPayload) => {
				res.status(200).json(validated)
			})
			.catch((err: Error) => res.status(401).send(err));
	}
}