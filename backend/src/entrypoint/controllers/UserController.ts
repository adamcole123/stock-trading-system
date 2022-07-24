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
import IGetAllUsersUseCase from "../../usecases/Users/IGetAllUsersUseCase";
import IGetUserDetailsUseCase from "../../usecases/Users/IGetUserDetailsUseCase";
import IEmailDto from "../../usecases/data_tranfer_objects/IEmailDto";
import IPasswordResetUseCase from "src/usecases/Users/IPasswordResetUseCase";
import { ApiPath, ApiOperationPost, SwaggerDefinitionConstant } from "swagger-express-ts";
import { ApiOperationGet } from "swagger-express-ts";

dotenv.config();

@ApiPath({
	name: 'Users',
	path: '/user',
})
@controller('/user')
export default class UserController implements interfaces.Controller {
	private readonly userSignInUseCase: IUserSignInUseCase;
	private readonly userRegisterUseCase: IUserRegisterUseCase;
	private readonly validateUserTokenUseCase: IValidateUserTokenUseCase;
	private readonly editUserDetailsUseCase: IEditUserDetailsUseCase;
	private readonly addNewCreditCardUseCase: IAddNewCreditCardUseCase;
	private readonly activateUserAccountUseCase: IActivateUserAccountUseCase;
	private readonly sendEmailUseCase: ISendEmailUseCase;
	private readonly getAllUsersUseCase: IGetAllUsersUseCase;
	private readonly getUserDetailsUseCase: IGetUserDetailsUseCase;
	private readonly passwordResetUseCase: IPasswordResetUseCase;

	constructor(@inject(TYPES.UserServiceLocator) serviceLocator: UserServiceLocator,
		@inject(TYPES.EmailServiceLocator) emailServiceLocator: EmailServiceLocator) {
		this.userSignInUseCase = serviceLocator.GetUserSignInUseCase();
		this.userRegisterUseCase = serviceLocator.GetUserRegisterUseCase();
		this.validateUserTokenUseCase = serviceLocator.GetValidateUserTokenUseCase();
		this.editUserDetailsUseCase = serviceLocator.GetEditUserDetailsUseCase();
		this.addNewCreditCardUseCase = serviceLocator.GetAddNewCreditCardUseCase();
		this.activateUserAccountUseCase = serviceLocator.GetActivateUserAccountUseCase();
		this.getAllUsersUseCase = serviceLocator.GetGetAllUsersUseCase();
		this.getUserDetailsUseCase = serviceLocator.GetGetUserDetailsUseCase();
		this.passwordResetUseCase = serviceLocator.GetPasswordResetUseCase();
		this.sendEmailUseCase = emailServiceLocator.GetSendEmailUseCase();
	}

	@ApiOperationGet({
		description: 'This is used to test how the server responds when an endpoint throws an unexpected error',
		path: '/test-error',
		responses: {}
	})
	@httpGet('/test-error')
	public testError(@request() req: express.Request, @response() res: express.Response) {
		throw new Error('test error');
	}

	@ApiOperationPost({
		description: 'Reset user password',
		path: '/password-reset',
		parameters: {
			body: {
				properties: {
					key: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					},
					password: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					}
				}
			},
		},
		responses: {
			200: {
				description: "Success",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			},
			401: { description: "User not authorised" },
			500: {
				description: "'Must enter a new password' or 'Must enter an email address'"
			}
		},
	})
	@httpPost('/password-reset')
	public async passwordReset(@request() req: express.Request, @response() res: express.Response) {
		if (req.body.key === undefined && req.cookies.token === undefined) {
			return res.status(500).json({ error: 'Must enter an email address' });
		}

		if (req.body.password === undefined) {
			return res.status(500).json({ error: 'Must enter a new password' });
		}

		let jwtSecretKey = process.env.JWT_SECRET_KEY;

		let verified = req.body.key ? await <IUserDto>jwt.verify(req.body.key, jwtSecretKey!) : await <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);

		return await this.passwordResetUseCase.invoke({ email: verified.email, password: req.body.password })
			.then(() => {
				res.status(200).json('Password reset successfully');
			})
			.catch((err: Error) => {
				res.status(500).json(err)
			});
	}

	@ApiOperationPost({
		description: 'Request a password reset for the user',
		path: '/password-reset-request',
		parameters: {
			body: {
				properties: {
					email: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					}
				}
			},
		},
		responses: {
			200: {
				description: "Success",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			},
			401: { description: "User not authorised" },
			500: {
				description: "'Must enter a new password' or 'Must enter an email address'"
			}
		},
	})
	@httpPost('/password-reset-request')
	public async passwordResetRequest(@request() req: express.Request, @response() res: express.Response) {
		if (req.body.email === undefined) {
			return res.status(500).json('Must enter an email address');
		}

		let jwtSecretKey = process.env.JWT_SECRET_KEY;

		return await this.sendEmailUseCase.invoke({
			to: [req.body.email],
			from: "noreply@stock-trading-system.com",
			subject: "Password reset link",
			bodyText: `http://localhost:8080/password-reset?key=${await jwt.sign({ requestTime: new Date(), email: req.body.email }, jwtSecretKey!)}`,
			bodyHtml: `<a href='http://localhost:8080/password-reset?key=${await jwt.sign({ requestTime: new Date(), email: req.body.email }, jwtSecretKey!)}'>Click to reset password</a>`
		})
			.then((emailDto: IEmailDto) => {
				res.status(200).json('Email sent successfully');
			})
			.catch((err: Error) => {
				res.status(400).json(err)
			});
	}

	@ApiOperationGet({
		description: 'Get a list of all users, only available to users with the Admin role',
		path: '/all',
		responses: {
			200: {
				description: "Success",
				type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
				model: 'User'
			},
			401: { description: "User is not an admin" },
			500: {}
		},
	})
	@httpGet('/all')
	public async getAllUsers(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;

		let verified = <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);

		if (verified.role !== "Admin") {
			return res.status(401).json('User is not an admin');
		}

		return await this.getAllUsersUseCase.invoke()
			.then((userDtos: IUserDto[]) => {
				res.status(200).json(userDtos);
			})
			.catch((err: Error) => {
				res.status(500).json(err)
			});
	}

	@ApiOperationGet({
		description: 'Get the details of one user',
		path: '/one',
		parameters: {
			query: {
				properties: {
					username: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					}
				}
			},
		},
		responses: {
			200: {
				description: "Success",
				model: 'User'
			},
			401: { description: "Not authorised to retrieve this users data." },
			500: {}
		}
	})
	@httpGet('/one')
	public async getUserDetails(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;

		let verified = <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);

		if (verified.role !== "Admin" && verified.username !== req.query.username) {
			return res.status(401).json('Not authorised to retrieve this user\'s data.');
		}

		return await this.getUserDetailsUseCase.invoke({ username: <string>req.query.username })
			.then((userDto: IUserDto) => {
				res.status(200).json(userDto);
			})
			.catch((err: Error) => {
				res.status(500).json(err)
			});
	}

	@ApiOperationPost({
		description: 'Provide username and password, receive a cookie of user\'s encrypted data',
		path: '/signin',
		parameters: {
			body: {
				properties: {
					username: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					},
					password: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					}
				}
			},
		},
		responses: {
			200: {
				description: "Logged in successfully 😊 👌",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			},
			400: { description: "Username or password not inputted" },
			500: {
				description: "Could not sign in user"
			}
		},
	})
	@httpPost('/signin')
	public async signInUser(@request() req: express.Request, @response() res: express.Response) {
		if (!req.body.username || !req.body.password) {
			return res.status(400).json('Username or password not inputted');
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
						secure: process.env.NODE_ENV === 'production',
						expires: new Date(604800000 + Date.now()),
					})
						.status(200)
						.json({ message: "Logged in successfully 😊 👌" });
				} catch (error) {
					res.status(500).json(error)
				}
			})
			.catch((err: Error) => {
				res.status(500).json(err)
			});
	}

	@ApiOperationPost({
		description: 'Provide username, email, firstName, lastName, password, and birthDate which will be saved as an unactivated user. An activation email is subsequently sent',
		path: '/register',
		parameters: {
			body: {
				properties: {
					username: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					},
					email: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					},
					firstName: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					},
					lastName: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					},
					password: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					},
					birthDate: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					}
				}
			},
		},
		responses: {
			200: {
				description: "Registered successfully 😊 👌\nActivation email sent!",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			},
			500: {}
		},
	})
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
					bodyText: `Go here to activate: http://localhost:8080/activate?token=${token}`,
					bodyHtml: `Click <a href='http://localhost:8080/activate?token=${token}'>here</a> to activate`
				})
					.then(email => {
						res
							.status(200)
							.json("Registered successfully 😊 👌\nActivation email sent!");
					});
			})
			.catch((err: Error) => {
				res.status(500).json(err)
			});
	}

	@ApiOperationPost({
		description: 'Add new credit card to user profile',
		path: '/credit-card',
		parameters: {
			body: {
				model: 'CreditCard'
			},
		},
		responses: {
			200: {
				description: "New card added successfully",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			},
			500: {}
		},
	})
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
					.json("New card added successfully");
			})
			.catch((err: Error) => {
				res.status(500).json(err)
			});
	}

	@ApiOperationPost({
		description: 'Validate the user\'s token cookie',
		path: '/validate',
		parameters: {},
		responses: {
			200: {
				description: "Success",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			},
			500: {
				description: "Could not validate user",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			}
		},
	})
	@httpPost('/validate')
	public async validateUser(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;

		if (!jwtSecretKey) {
			return res.status(500).json('Could not validate user');
		}

		return await this.validateUserTokenUseCase.invoke(req.cookies.token)
			.then((validated: IUserDto) => {
				const token = jwt.sign(validated, jwtSecretKey!, { expiresIn: "7 days" });
				res.cookie("token", token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					expires: new Date(604800000 + Date.now()),
				})
					.status(200).json(validated)
			})
			.catch((err: Error) => res.status(401).send(err));
	}

	@ApiOperationPost({
		description: 'Edit user details',
		path: '/edit',
		parameters: {
			body: {
				model: 'User'
			},
		},
		responses: {
			200: {
				description: "Success",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			},
			401: { description: "Not authorised to change this user\'s data." },
			500: {}
		},
	})
	@httpPost('/edit')
	public async editUser(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;

		let edittedUser: IUserDto;

		if (req.body.key) {
			edittedUser = await <IUserDto>jwt.verify(req.body.key, jwtSecretKey!);
		} else {
			edittedUser = {
				...req.body
			}
		}

		let verified = <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);

		if (verified.role !== "Admin" && verified.username !== req.body.username) {
			return res.status(401).json('Not authorised to retrieve this user\'s data.');
		}

		let userObjectKeys = Object.keys(edittedUser);

		if (userObjectKeys.length === 2 &&
			userObjectKeys.includes('username') &&
			userObjectKeys.includes('role') &&
			verified.role !== "Admin") {
			return res.status(401).json('Not authorised to change user roles.');
		}

		if (verified.role !== 'Admin' && edittedUser.banUntil) {
			delete edittedUser.banUntil;
		}

		if (edittedUser.credit !== undefined) {
			delete edittedUser.credit;
		}

		if (verified.role !== "Admin" && verified.username === req.body.username) {
			if (!req.body.key) {
				return await this.sendEmailUseCase.invoke({
					to: [verified.email!, edittedUser.email!],
					from: "noreply@stocktradingsystem.com",
					subject: "Confirm details change",
					bodyText: `Click here to confirm your account details change: http://localhost:8080/account/edit?key=${await jwt.sign(edittedUser, jwtSecretKey!)}`,
					bodyHtml: `Click <a href="http://localhost:8080/account/edit?key=${await jwt.sign(edittedUser, jwtSecretKey!)}">here</a> to confirm your account details change`
				})
					.then((email) => {
						res.status(200).json("Email sent to confirm changes!");
					})
					.catch((err) => {
						res.status(500).json(err);
					})
			}
		}


		return await this.editUserDetailsUseCase.invoke(edittedUser.username!, edittedUser)
			.then((userDto: IUserDto) => {
				res.status(200).json(userDto)
			})
			.catch((err: Error) => res.status(400).json(err));
	}

	@ApiOperationGet({
		description: 'Sign out currently signed in user by removing their cookie',
		path: '/signin',
		responses: {
			200: {
				description: "Signed out successfully!",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			}
		},
	})
	@httpGet('/signout')
	public async signOut(@request() req: express.Request, @response() res: express.Response) {
		res.clearCookie("token").status(200).json("Signed out successfully!");
	}

	@ApiOperationPost({
		description: 'Activate user account by passing in token with user\'s username',
		path: '/activate',
		parameters: {
			body: {
				properties: {
					token: {
						required: true,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					}
				}
			}
		},
		responses: {
			200: {
				description: "Send email to admin user notifying them of the user activating their account.",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			},
			500: {}
		},
	})
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
			.catch((err: Error) => res.status(500).send(err));
	}

	@ApiOperationPost({
		description: 'Send email to an admin to request deactivation',
		path: '/requestdeactivation',
		parameters: {
			body: {
				properties: {
					username: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					},
					password: {
						required: false,
						type: SwaggerDefinitionConstant.Parameter.Type.STRING,
					}
				}
			},
		},
		responses: {
			200: {
				description: "Request sent to administrator.",
				type: SwaggerDefinitionConstant.Parameter.Type.STRING
			},
			500: {}
		},
	})
	@httpPost('/requestdeactivation')
	public async requestAccountDeactivation(@request() req: express.Request, @response() res: express.Response) {
		let jwtSecretKey = process.env.JWT_SECRET_KEY;

		let verified = <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);

		return await this.sendEmailUseCase.invoke({
			to: ["admin@stocktradingsystem.com"],
			from: "noreply@stocktradingsystem.com",
			subject: "A user has requested deactivation",
			bodyText: `Visit http://localhost:8080/user?username=${verified.username} to mark account as deleted.`,
			bodyHtml: `Visit <a href="http://localhost:8080/user?username=${verified.username}">this page</a> to mark account as deleted.`
		})
			.then(email => {
				res.status(200).json("Request sent to administrator.");
			})
			.catch((err: Error) => res.status(500).send(err));
	}
}