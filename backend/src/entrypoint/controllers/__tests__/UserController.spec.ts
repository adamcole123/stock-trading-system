import 'reflect-metadata';
import { cleanUpMetadata, cookies, interfaces, InversifyExpressServer } from 'inversify-express-utils';
import UserServiceLocator from '../../../configuration/UserServiceLocator';
import FakeUserReadOnlyRepository from '../../../infrastructure/FakeUserReadOnlyRepository';
import FakeUserWriteOnlyRepository from '../../../infrastructure/FakeUserWriteOnlyRepository';
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
import users from '../../../infrastructure/FakeUserData';
import { mock } from 'jest-mock-extended';

let userController = new UserController(new UserServiceLocator(new FakeUserReadOnlyRepository(), new FakeUserWriteOnlyRepository()));

// set up container
const container = new Container();


let server = new InversifyExpressServer(container);

let controller;

let userObj = users;

describe('UserController Tests', () => {
	let controller: UserController;

	// set up bindings
	container.bind<UserServiceLocator>(TYPES.UserServiceLocator).to(UserServiceLocator);
	container.bind<IUserReadOnlyRepository>(TYPES.IUserReadOnlyRepository).to(FakeUserReadOnlyRepository);
	container.bind<IUserWriteOnlyRepository>(TYPES.IUserWriteOnlyRepository).to(FakeUserWriteOnlyRepository);
	container.bind<interfaces.HttpContext>(Symbol.for("HttpContext")).toConstantValue(mockedHttpContext);

	beforeAll(async () => {
		jest.clearAllMocks();
		cleanUpMetadata();
		dotenv.config();
		controller = new UserController(container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")));
	});

	it('User sign in route', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/user/signin',
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

		let responseObj = httpMocks.createResponse();

		await controller.signInUser(requestObj, responseObj);

		expect(responseObj._getStatusCode()).toBe(200);
	})

	it('User register route', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/user/register',
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

		await controller.registerUser(requestObj, responseObj)

		expect(responseObj._getStatusCode()).toBe(200);
	})

	it('User has £50,000 upon registration', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/user/register',
			body: {
				"id": "x",
				"username": "testy_username",
				"password": "testy1password",
				"email": "testyemail@test.com",
				"firstName": "testyfname",
				"lastName": "testylname",
				"reports": []
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.registerUser(requestObj, responseObj);
		
		expect(userObj.find(x => x.id === "x")!.credit).toBe(50000);
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
			method: 'POST',
			url: '/user/signin',
			cookies: {token:token}
		});

		let responseObj = httpMocks.createResponse();

		await controller.validateUser(requestObj, responseObj)

		let responseData = <IUserDto>(responseObj._getJSONData());
		
		expect(responseData.email).toBe("testxemail@test.com")
		expect(responseData.id).toBe("x")
		expect(responseData.username).toBe("testx_username")
		expect(responseData.firstName).toBe("testxfname")
		expect(responseData.lastName).toBe("testxlname")
		expect(responseData.password).toBe("")
		expect(responseData.reports).toStrictEqual([{"id": "report1id", "report_data": ",,,", "report_type": 1}, {"id": "report2id", "report_data": ",,,", "report_type": 0}, {"id": "report3id", "report_data": ",,,", "report_type": 1}, {"id": "report4id", "report_data": ",,,", "report_type": 1}])
	})

	it('User edit route signed in user', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/user/edit',
			body: {
				userToEdit: "test3_username",
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
				],
				testid_1: "newid",
				token: jwt.sign({username: "test3_username"}, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.editUser(requestObj, responseObj)

		let responseData = jwt.verify(responseObj._getJSONData(), process.env.JWT_SECRET_KEY!);

		responseData = <IUserDto>(responseData);
		
		expect(responseData.email).toBe("newemail")
		expect(responseData.username).toBe("newusername")
		expect(responseData.firstName).toBe("newfirstname")
		expect(responseData.lastName).toBe("newlastname")
		expect(responseData.reports).toStrictEqual([
			{
				id: "newreportid",
				report_data: "newreportdata",
				report_type: 1
			}
		])
	})

	it('User edit route admin', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/user/edit',
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
				],
				testid_1: "newid",
				token: jwt.sign({role: 2}, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.editUser(requestObj, responseObj)

		let responseData = jwt.verify(responseObj._getJSONData(), process.env.JWT_SECRET_KEY!);

		responseData = <IUserDto>(responseData);
		
		expect(responseData.email).toBe("newemail")
		expect(responseData.username).toBe("newusername")
		expect(responseData.firstName).toBe("newfirstname")
		expect(responseData.lastName).toBe("newlastname")
		expect(responseData.reports).toStrictEqual([
			{
				id: "newreportid",
				report_data: "newreportdata",
				report_type: 1
			}
		])
	})
});