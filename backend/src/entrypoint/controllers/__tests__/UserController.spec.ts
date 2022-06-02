import 'reflect-metadata';
import { cleanUpMetadata, interfaces } from 'inversify-express-utils';
import UserServiceLocator from '../../../configuration/UserServiceLocator';
import UserController from '../UserController';
import IUserReadOnlyRepository from '../../../application/repositories/IUserReadOnlyRepository';
import IUserWriteOnlyRepository from '../../../application/repositories/IUserWriteOnlyRepository';
import { Container } from 'inversify';
import { TYPES } from '../../../constants/types';
import { mockedHttpContext } from '../MockHttpContext';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import httpMocks from 'node-mocks-http';
import IUserDto from '../../../usecases/data_tranfer_objects/IUserDto';
import { mock } from 'jest-mock-extended';
import EmailServiceLocator from '../../../configuration/EmailServiceLocator';
import Encrypter from '../../../infrastructure/Encrypter';
import IEncrypter from '../../../infrastructure/IEncrypter';
import bcrypt from 'bcryptjs';

// set up container
const container = new Container();

describe('UserController Tests', () => {
	let controller: UserController;
	let userReadOnlyRepository: IUserReadOnlyRepository = mock<IUserReadOnlyRepository>();
	let userWriteOnlyRepository: IUserWriteOnlyRepository = mock<IUserWriteOnlyRepository>();

	// set up bindings
	container.bind<UserServiceLocator>(TYPES.UserServiceLocator).to(UserServiceLocator);
	container.bind<EmailServiceLocator>(TYPES.EmailServiceLocator).to(EmailServiceLocator);
	container.bind<IUserReadOnlyRepository>(Symbol.for("IUserReadOnlyRepository")).toConstantValue(userReadOnlyRepository);
	container.bind<IUserWriteOnlyRepository>(Symbol.for("IUserWriteOnlyRepository")).toConstantValue(userWriteOnlyRepository);
	container.bind<IEncrypter>(TYPES.IEncrypter).to(Encrypter);
	container.bind<interfaces.HttpContext>(Symbol.for("HttpContext")).toConstantValue(mockedHttpContext);

	beforeAll(async () => {
		jest.clearAllMocks();
		cleanUpMetadata();
		dotenv.config();
		controller = new UserController(container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")),
			container.get<EmailServiceLocator>(Symbol.for("EmailServiceLocator")));
	});
	it('User sign in route', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				"id": "",
				"username": "test1_username",
				"password": "test1password",
				"email": "",
				"firstName": "",
				"lastName": "",
				"reports": []
			}
		});

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			username: "test1_username",
			password: bcrypt.hashSync("test1password", await bcrypt.genSalt(10)),
			activationDate: new Date(),
			isDeleted: false
		});

		let responseObj = httpMocks.createResponse();

		await controller.signInUser(requestObj, responseObj);

		expect(responseObj._getStatusCode()).toBe(200);
	})
	it('User register route', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				"id": "x",
				"username": "testx_username",
				"password": "testxpassword",
				"email": "testxemail@test.com",
				"firstName": "testxfname",
				"lastName": "testxlname",
				"reports": []
			}
		});

		let responseObj = httpMocks.createResponse();

		mock(userWriteOnlyRepository).create.mockResolvedValue({
			"id": "x",
			"username": "testx_username",
			"password": "testxpassword",
			"email": "testxemail@test.com",
			"firstName": "testxfname",
			"lastName": "testxlname",
			"reports": []
		})

		await controller.registerUser(requestObj, responseObj)

		expect(responseObj._getStatusCode()).toBe(200);
	})
	it('User validate route', async () => {
		let token = jwt.sign(
			`{
				"id": "x",
				"username": "testx_username",
				"password": "testxpassword",
				"email": "testxemail@test.com",
				"firstName": "testxfname",
				"lastName": "testxlname",
				"reports": [{"id": "report1id", "report_data": ",,,", "report_type": 1}, {"id": "report2id", "report_data": ",,,", "report_type": 0}, {"id": "report3id", "report_data": ",,,", "report_type": 1}, {"id": "report4id", "report_data": ",,,", "report_type": 1}]
			}`, process.env.JWT_SECRET_KEY!).toString();

		let requestObj = httpMocks.createRequest({
			cookies: { token: token }
		});

		mock(userReadOnlyRepository).fetch.mockResolvedValue({
			"id": "x",
			"username": "testx_username",
			"password": "testxpassword",
			"email": "testxemail@test.com",
			"firstName": "testxfname",
			"lastName": "testxlname",
			"reports": [
				{ "id": "report1id", "report_data": ",,,", "report_type": "CSV" },
				{ "id": "report2id", "report_data": ",,,", "report_type": "CSV" },
				{ "id": "report3id", "report_data": ",,,", "report_type": "CSV" },
				{ "id": "report4id", "report_data": ",,,", "report_type": "CSV" }
			]
		})

		let responseObj = httpMocks.createResponse();

		await controller.validateUser(requestObj, responseObj)

		let responseData = <IUserDto>(responseObj._getJSONData());

		expect(responseData.email).toBe("testxemail@test.com")
		expect(responseData.id).toBe("x")
		expect(responseData.username).toBe("testx_username")
		expect(responseData.firstName).toBe("testxfname")
		expect(responseData.lastName).toBe("testxlname")
		expect(responseData.password).toBe("")
		expect(responseData.reports).toStrictEqual([
			{
				"id": "report1id",
				"report_data": ",,,",
				"report_type": "CSV"
			},
			{
				"id": "report2id",
				"report_data": ",,,",
				"report_type": "CSV"
			},
			{
				"id": "report3id",
				"report_data": ",,,",
				"report_type": "CSV"
			},
			{
				"id": "report4id",
				"report_data": ",,,",
				"report_type": "CSV"
			}])
	})
	it('User edit route signed in user', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				username: "test3_username",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail@test.com",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: 1
					}
				],
			},
			cookies: {
				token: jwt.sign({ username: "test3_username" }, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.editUser(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData).toBe("Email sent to confirm changes!")
	})
	it('User edit route admin', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				userToEdit: "test1_username",
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: 1
					}
				]
			},
			cookies: {
				token: jwt.sign({ role: "Admin" }, process.env.JWT_SECRET_KEY!)
			}
		});
		mock(userWriteOnlyRepository).edit.mockResolvedValue({
			username: "newusername",
			firstName: "newfirstname",
			lastName: "newlastname",
			email: "newemail",
			reports: [
				{
					id: "newreportid",
					report_data: "newreportdata",
					report_type: "CSV"
				}
			]
		})

		let responseObj = httpMocks.createResponse();

		await controller.editUser(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData.email).toBe("newemail")
		expect(responseData.username).toBe("newusername")
		expect(responseData.firstName).toBe("newfirstname")
		expect(responseData.lastName).toBe("newlastname")
		expect(responseData.reports).toStrictEqual([
			{
				"id": "newreportid",
				"report_data": "newreportdata",
				"report_type": "CSV",
			}
		])
	})
	it('Password reset admin', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				password: 'newpassword'
			},
			cookies: {
				token: jwt.sign({ role: "Admin" }, process.env.JWT_SECRET_KEY!)
			}
		});
		mock(userWriteOnlyRepository).edit.mockResolvedValue({
			username: "newusername",
			firstName: "newfirstname",
			lastName: "newlastname",
			email: "newemail",
			reports: [
				{
					id: "newreportid",
					report_data: "newreportdata",
					report_type: "CSV"
				}
			],
			password: 'newpassword'
		})

		let responseObj = httpMocks.createResponse();

		await controller.passwordReset(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData).toBe("Password reset successfully");
	})
	it('Password reset user', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				key: await jwt.sign({ password: 'newpassword', username: "testusername" }, process.env.JWT_SECRET_KEY!),
				password: "newpassword"
			},
			cookies: {
				token: jwt.sign({ username: "testusername" }, process.env.JWT_SECRET_KEY!)
			}
		});
		mock(userWriteOnlyRepository).edit.mockResolvedValue({
			username: "newusername",
			firstName: "newfirstname",
			lastName: "newlastname",
			email: "newemail",
			reports: [
				{
					id: "newreportid",
					report_data: "newreportdata",
					report_type: "CSV"
				}
			],
			password: 'newpassword'
		})

		let responseObj = httpMocks.createResponse();

		await controller.passwordReset(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData).toBe("Password reset successfully");
	})
	it('Password reset request', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				email: "testemail@test.com"
			},
			cookies: {
				token: jwt.sign({ username: "testusername" }, process.env.JWT_SECRET_KEY!)
			}
		});
		mock(userWriteOnlyRepository).edit.mockResolvedValue({
			username: "newusername",
			firstName: "newfirstname",
			lastName: "newlastname",
			email: "newemail",
			reports: [
				{
					id: "newreportid",
					report_data: "newreportdata",
					report_type: "CSV"
				}
			],
			password: 'newpassword'
		})

		let responseObj = httpMocks.createResponse();

		await controller.passwordResetRequest(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData).toBe("Email sent successfully");
	})
	it('Get all users', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ role: "Admin" }, process.env.JWT_SECRET_KEY!)
			}
		});
		mock(userReadOnlyRepository).fetchAll.mockResolvedValue([
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
			},
			{
				username: "newusername2",
				firstName: "newfirstname2",
				lastName: "newlastname2",
				email: "newemail2",
				reports: [
					{
						id: "newreportid2",
						report_data: "newreportdata2",
						report_type: "CSV"
					}
				],
			}
		])

		let responseObj = httpMocks.createResponse();

		await controller.getAllUsers(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData).toStrictEqual(expect.objectContaining([{
			"email": "newemail",
			"firstName": "newfirstname",
			"lastName": "newlastname",
			"reports": [{
				"id": "newreportid",
				"report_data": "newreportdata",
				"report_type": "CSV"
			}],
			"username": "newusername"
		}, {
			"email": "newemail2",
			"firstName": "newfirstname2",
			"lastName": "newlastname2",
			"reports": [{
				"id": "newreportid2",
				"report_data": "newreportdata2",
				"report_type": "CSV"
			}],
			"username": "newusername2"
		}]));
	});
	it('Get user details admin', async () => {
		let requestObj = httpMocks.createRequest({
			query: {
				username: "newusername"
			},
			cookies: {
				token: jwt.sign({ role: "Admin" }, process.env.JWT_SECRET_KEY!)
			}
		});
		mock(userReadOnlyRepository).fetch.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
			}
		)

		let responseObj = httpMocks.createResponse();

		await controller.getUserDetails(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData).toStrictEqual(expect.objectContaining({
			"email": "newemail",
			"firstName": "newfirstname",
			"lastName": "newlastname",
			"username": "newusername"
		}));
	});
	it('Get user details user', async () => {
		let requestObj = httpMocks.createRequest({
			query: {
				username: "newusername"
			},
			cookies: {
				token: jwt.sign({ username: "newusername" }, process.env.JWT_SECRET_KEY!)
			}
		});
		mock(userReadOnlyRepository).fetch.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
			}
		)

		let responseObj = httpMocks.createResponse();

		await controller.getUserDetails(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData).toStrictEqual(expect.objectContaining({
			"email": "newemail",
			"firstName": "newfirstname",
			"lastName": "newlastname",
			"username": "newusername"
		}));
	});
	it('Add new credit card', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				userId: "test",
				cardDetails: {
					cardNumber: "7575848429294848",
					expiryDate: "03/25",
					cvv: "543",
					nameOnCard: "test",
					addressLine1: "test",
					city: "test",
					county: "test",
					postcode: "test",
					country: "test"
				}
			},
			cookies: {
				token: jwt.sign({ role: "Admin" }, process.env.JWT_SECRET_KEY!)
			}
		});
		mock(userWriteOnlyRepository).edit.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
				cardDetails: [
					{
						cardNumber: "7575848429294848",
						expiryDate: "03/25",
						cvv: "543",
						nameOnCard: "test",
						addressLine1: "test",
						city: "test",
						county: "test",
						postcode: "test",
						country: "test"
					}
				]
			}
		)

		let responseObj = httpMocks.createResponse();

		await controller.addNewCreditCard(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		let edittedUser = jwt.verify(responseObj.cookies.token.value, process.env.JWT_SECRET_KEY!);

		expect(edittedUser).toStrictEqual(expect.objectContaining({
			username: "newusername",
			firstName: "newfirstname",
			lastName: "newlastname",
			email: "newemail",
			reports: [
				{
					id: "newreportid",
					report_data: "newreportdata",
					report_type: "CSV"
				}
			],
			cardDetails: [
				{
					cardNumber: "7575848429294848",
					expiryDate: "03/25",
					cvv: "543",
					nameOnCard: "test",
					addressLine1: "test",
					city: "test",
					county: "test",
					postcode: "test",
					country: "test"
				}
			]
		}));
		expect(responseData).toBe("New card added successfully");
	})
	it('Activate user', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				token: jwt.sign({ username: "testusername" }, process.env.JWT_SECRET_KEY!)
			}
		});
		mock(userWriteOnlyRepository).edit.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
				cardDetails: [],
				activationDate: new Date()
			}
		)

		let responseObj = httpMocks.createResponse();

		await controller.activateUser(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData).toStrictEqual(expect.objectContaining({
			"activationDate": expect.anything(),
			"cardDetails": [],
			"email": "newemail",
			"firstName": "newfirstname",
			"lastName": "newlastname",
			"reports": [{
				"id": "newreportid",
				"report_data": "newreportdata",
				"report_type": "CSV"
			}],
			"username": "newusername"
		}));
	})
	it('Request account deactivation', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ username: "testusername" }, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.requestAccountDeactivation(requestObj, responseObj)

		let responseData = responseObj._getJSONData();

		responseData = <IUserDto>(responseData);

		expect(responseData).toEqual("Request sent to administrator.");
	})
});