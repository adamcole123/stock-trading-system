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
import IAddNewCreditCardUseCase from '../../usecases/Users/IAddNewCreditCardUseCase';
import ICreditCardDto from '../../usecases/data_tranfer_objects/ICreditCardDto';
import IActivateUserAccountUseCase from "src/usecases/Users/IActivateUserAccountUseCase";
import EmailServiceLocator from "../../configuration/EmailServiceLocator";
import ISendEmailUseCase from '../../usecases/Email/ISendEmailUseCase';

dotenv.config();

@controller('/user')
export default class UserController implements interfaces.Controller {
	private readonly userSignInUseCase: IUserSignInUseCase;
	private readonly userRegisterUseCase: IUserRegisterUseCase;
	private readonly validateUserTokenUseCase: IValidateUserTokenUseCase;
	private readonly editUserDetailsUseCase: IEditUserDetailsUseCase;
	private readonly addNewCreditCardUseCase: IAddNewCreditCardUseCase;
	private readonly activateUserAccountUseCase: IActivateUserAccountUseCase;
	private readonly sendEmailUseCase: ISendEmailUseCase;

	constructor(@inject(TYPES.UserServiceLocator) serviceLocator: UserServiceLocator,
				@inject(TYPES.EmailServiceLocator) emailServiceLocator: EmailServiceLocator) {
		this.userSignInUseCase = serviceLocator.GetUserSignInUseCase();
		this.userRegisterUseCase = serviceLocator.GetUserRegisterUseCase();
		this.validateUserTokenUseCase = serviceLocator.GetValidateUserTokenUseCase();
		this.editUserDetailsUseCase = serviceLocator.GetEditUserDetailsUseCase();
		this.addNewCreditCardUseCase = serviceLocator.GetAddNewCreditCardUseCase();
		this.activateUserAccountUseCase = serviceLocator.GetActivateUserAccountUseCase();
		this.sendEmailUseCase = emailServiceLocator.GetSendEmailUseCase();
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
					return res.status(500).json('Could not sign in user');
				}

				try {
					const token = jwt.sign(userDto, jwtSecretKey!, { expiresIn: "7 days" });
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
				res.status(400).json(err)
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
			birthDate: req.body.birthDate
		}

		return await this.userRegisterUseCase.invoke(newUser)
			.then(async (userDto: IUserDto) => {
				let jwtSecretKey = process.env.JWT_SECRET_KEY;

				const token = jwt.sign({
					id: userDto.id,
					firstName: userDto.firstName,
					lastName: userDto.lastName,
					credit: userDto.credit,
					birthDate: userDto.birthDate,
					email: userDto.email,
					reports: userDto.reports,
					role: userDto.role,
					username: userDto.username,
					cardDetails: userDto.cardDetails,
				}, jwtSecretKey!, { expiresIn: "7 days" });

				await this.sendEmailUseCase.invoke({
					to: [userDto.email!],
					from: "noreply@stocktradingsystem.com",
					subject: "Activate your stock trading account",
					bodyText: `Click to activate: http://localhost:8080/activate?token=${token}`,
					bodyHtml: `Click to activate: <b>http://localhost:8080/activate?token=${token}</b>`
				})
				.then(email => {
					res
					.status(200)
					.json({ message: "Registered successfully 😊 👌\nActivation email sent!" });
				});
			})
			.catch((err: Error) => {
				res.status(400).json(err)
			});
	}

	@httpPost('/credit-card')
	public async addNewCreditCard(@request() req: express.Request, @response() res: express.Response) {
		let newCard: ICreditCardDto = req.body.cardDetails;

		return await this.addNewCreditCardUseCase.invoke(newCard, req.body.userId)
			.then((userDto: IUserDto) => {
				let jwtSecretKey = process.env.JWT_SECRET_KEY;

				const token = jwt.sign({
					id: userDto.id,
					firstName: userDto.firstName,
					lastName: userDto.lastName,
					credit: userDto.credit,
					birthDate: userDto.birthDate,
					email: userDto.email,
					reports: userDto.reports,
					role: userDto.role,
					username: userDto.username,
					cardDetails: userDto.cardDetails,
				}, jwtSecretKey!, { expiresIn: "7 days" });

				res.cookie("token", token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production'
				})
					.status(200)
					.json({ message: "New card added successfully" });
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
			.then((userDto: IUserDto) => {

				const token = jwt.sign(userDto, jwtSecretKey!, { expiresIn: "7 days" });

				res.status(200).json(token)
			})
			.catch((err: Error) => res.status(400).json(err));
	}

	@httpGet('/signout')
	public async signOut(@request() req: express.Request, @response() res: express.Response) {
		res.clearCookie("token").status(200).json({ message: "Signed out successfully!" });
	}

@httpPost('/activate')
	public async activateUser(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		
		let verified = <IUserDto>jwt.verify(req.body.token, jwtSecretKey!);

		return await this.activateUserAccountUseCase.invoke(verified)
			.then(async (activatedUser: IUserDto) => {
				await this.sendEmailUseCase.invoke({
					to: ["admin@stocktradingsystem.com"],
					from: "noreply@stocktradingsystem.com",
					subject: "New user has been activated!",
					bodyText: `User with username ${activatedUser.username} has now been activated!`,
					bodyHtml: `User with username <b>${activatedUser.username}</b> has now been activated!`
				})
				.then(email => {
					res.status(200).json(activatedUser);
				});
			})
			.catch((err: Error) => res.status(401).send(err));
	}
}