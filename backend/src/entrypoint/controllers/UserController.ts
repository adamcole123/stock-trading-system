import { inject } from "inversify";
import { controller, httpGet, httpPost, interfaces, request, response } from "inversify-express-utils";
import * as express from "express";
import jwt from 'jsonwebtoken';
import UserServiceLocator from "../../configuration/UserServiceLocator";
import { TYPES } from "../../constants/types";
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import IUserRegisterUseCase from "../../usecases/Users/IUserRegisterUseCase";
import IUserSignInUseCase from "../../usecases/Users/IUserSignInUseCase";
import IValidateUserTokenUseCase from "../../usecases/Users/IValidateUserTokenUseCase";
import dotenv from 'dotenv';
import IEditUserDetailsUseCase from '../../usecases/Users/IEditUserDetailsUseCase';

dotenv.config();

@controller('/user')
export default class UserController implements interfaces.Controller {
	private readonly userSignInUseCase: IUserSignInUseCase;
	private readonly userRegisterUseCase: IUserRegisterUseCase;
	private readonly validateUserTokenUseCase: IValidateUserTokenUseCase;
	private readonly editUserDetailsUseCase: IEditUserDetailsUseCase;

	constructor(@inject(TYPES.UserServiceLocator) serviceLocator: UserServiceLocator) {
		this.userSignInUseCase = serviceLocator.GetUserSignInUseCase();
		this.userRegisterUseCase = serviceLocator.GetUserRegisterUseCase();
		this.validateUserTokenUseCase = serviceLocator.GetValidateUserTokenUseCase();
		this.editUserDetailsUseCase = serviceLocator.GetEditUserDetailsUseCase();
	}

	@httpPost('/signin')
	public async signInUser(@request() req: express.Request, @response() res: express.Response) {
		if (!req.body.username || !req.body.password) {
			return res.status(400).json({ error: 'Username or password not inputted' });
		}

		let reqUser: IUserDto = req.body;

		return await this.userSignInUseCase.invoke(reqUser)
			.then((userDto: IUserDto) => {
				let jwtSecretKey = process.env.JWT_SECRET_KEY;

				if (!jwtSecretKey) {
					return res.status(500).json({ err: 'Could not sign in user' });
				}

				try {
					const token = jwt.sign({ userDto }, jwtSecretKey!, { expiresIn: "7 days" });
					res.cookie("token", token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production'
					})
						.status(200)
						.json({ message: "Logged in successfully 😊 👌" });
				} catch (error) {
					res.status(500).json({ error: error })
				}

			})
			.catch((err: Error) => {
				res.status(400).json({ error: err })
			});
	}

	@httpPost('/register')
	public async registerUser(@request() req: express.Request, @response() res: express.Response) {
		let newUser: IUserDto = {
			username: req.body.username,
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
		}

		return await this.userRegisterUseCase.invoke(newUser)
			.then((userDto: IUserDto) => {
				let jwtSecretKey = process.env.JWT_SECRET_KEY;

				const token = jwt.sign({ userDto }, jwtSecretKey!, { expiresIn: "7 days" });

				res.cookie("token", token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production'
				})
					.status(200)
					.json({ message: "Registered successfully 😊 👌" });
			})
			.catch((err: Error) => {
				res.status(400).json(err)
			});
	}

	@httpPost('/validate')
	public async validateUser(@request() req: express.Request, @response() res: express.Response) {
		return await this.validateUserTokenUseCase.invoke(req.cookies.token)
			.then((validated: IUserDto) => {
				res.status(200).json(validated)
			})
			.catch((err: Error) => res.status(401).send(err));
	}

	@httpPost('/edit')
	public async editUser(@request() req: express.Request, @response() res: express.Response) {
		let editedUser: IUserDto = {
			username: req.body.username,
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
			reports: req.body.reports,
			id: req.body.id
		}

		let userToEdit = req.body.userToEdit

		let jwtSecretKey = process.env.JWT_SECRET_KEY

		return await this.editUserDetailsUseCase.invoke(userToEdit, editedUser, req.body.token)
			.then((editedUserDto: IUserDto) => {
				const token = jwt.sign(editedUserDto, jwtSecretKey!, { expiresIn: "7 days" });

				res.status(200).json(token)
			})
			.catch((err: Error) => res.status(400).json({ error: err.message }));
	}

	@httpGet('/signout')
	public async signOut(@request() req: express.Request, @response() res: express.Response) {
		res.clearCookie("token").status(200).json({ message: "Signed out successfully!" });
	}
}