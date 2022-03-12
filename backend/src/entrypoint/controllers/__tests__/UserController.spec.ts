import 'reflect-metadata';
import { cleanUpMetadata, interfaces, InversifyExpressServer, response, request } from 'inversify-express-utils';
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

let userController = new UserController(new UserServiceLocator(new FakeUserReadOnlyRepository(), new FakeUserWriteOnlyRepository()));

// set up container
const container = new Container();


let server = new InversifyExpressServer(container);

let controller;

describe('UserController Tests', () => {
	let controller: UserController;

	// set up bindings
	container.bind<UserServiceLocator>(TYPES.UserServiceLocator).to(UserServiceLocator);
	container.bind<IUserReadOnlyRepository>(TYPES.IUserReadOnlyRepository).to(FakeUserReadOnlyRepository);
	container.bind<IUserWriteOnlyRepository>(TYPES.IUserWriteOnlyRepository).to(FakeUserWriteOnlyRepository);
	container.bind<interfaces.HttpContext>(Symbol.for("HttpContext")).toConstantValue(mockedHttpContext);

	beforeAll(async () => {
		cleanUpMetadata();
		dotenv.config();
		controller = new UserController(container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")));
	});
	it('User sign in route', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/user/signin',
			body: {
				"id": "1",
				"username": "test1_username",
				"password": "test1password",
				"email": "",
				"firstName": "",
				"lastName": "",
				"reports": []
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.signInUser(requestObj, responseObj)

		let responseData = jwt.verify(responseObj._getJSONData(), process.env.JWT_SECRET_KEY!);

		expect(responseData.email!).toBe()

	it('User register route', () => {

	})

	it('User validate route', () => {

	})
})