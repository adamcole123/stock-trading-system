import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import 'reflect-metadata';
import config from '../../../test/utils/config';
import User from '../User/User';

import UserReadRepository from '../User/UserReadRepository';
import UserWriteRepository from '../User/UserWriteRepository';


describe('User Repositories', () => {

	let userReadRepository = new UserReadRepository();
	let userWriteRepository = new UserWriteRepository();

	beforeAll(async () => {
		if (config.Memory) { 
			const instance = await MongoMemoryServer.create();
			
			const uri = instance.getUri();
			(global as any).__MONGOINSTANCE = instance;
			process.env.MONGO_URI = `${uri}`;
		} else {
			process.env.MONGO_URI = `mongodb://${config.IP}:${config.Port}/${config.Database}`;
		}

		// The following is to make sure the database is clean before an test starts
		await mongoose.connect(`${process.env.MONGO_URI}`);
	})

	afterAll(async () => {
		await mongoose.disconnect();
	})

	beforeEach(async () => {
		await mongoose.connection.db.dropDatabase();

		await User.create({
			username: "testusername",
			email: "testemail@test.com",
			firstName: "testfirstname",
			lastName: "testlastname",
			birthDate: new Date(),
			reports: [
				{
					report_data: ",,,",
					report_date: new Date(),
					report_type: "CSV"
				},
				{
					report_data: ",,,",
					report_date: new Date(),
					report_type: "XML"
				},
			],
			password: "testpassword",
			credit: 43289,
			role: "User",
			isDeleted: false,
			cardDetails: [
				{
					cardDetails: "hashedCardDetails",
					key: "key"
				}
			],
			activationDate: new Date()
		})
	})

	it('fetchAll', async () => {
		let user = await userReadRepository.fetchAll();

		expect(user[0]).toEqual(expect.objectContaining({
			cardDetails: expect.arrayContaining([
				expect.objectContaining({
					cardDetails: "hashedCardDetails",
					key: "key"
				})
			]),
			credit: 43289,
			email: "testemail@test.com",
			firstName: "testfirstname",
			isDeleted: false,
			lastName: "testlastname",
			password: "testpassword",
			reports: expect.arrayContaining([
				expect.objectContaining({
					report_data: ",,,",
					report_type: "CSV"
				}),
				expect.objectContaining({
					report_data: ",,,",
					report_type: "XML"
				})]),
			role: "User",
			username: "testusername"
		}));
	})
	it('fetch', async () => {
		let user = await userReadRepository.fetch({
			username: "testusername"
		});

		expect(user).toEqual(expect.objectContaining({
			cardDetails: expect.arrayContaining([
				expect.objectContaining({
					cardDetails: "hashedCardDetails",
					key: "key"
				})
			]),
			credit: 43289,
			email: "testemail@test.com",
			firstName: "testfirstname",
			isDeleted: false,
			lastName: "testlastname",
			password: "testpassword",
			reports: expect.arrayContaining([
				expect.objectContaining({
					report_data: ",,,",
					report_type: "CSV"
				}),
				expect.objectContaining({
					report_data: ",,,",
					report_type: "XML"
				})]),
			role: "User",
			username: "testusername"
		}));
	})

	it('fetch by email', async () => {
		let user = await userReadRepository.fetch({
			email: "testemail@test.com"
		});

		expect(user).toEqual(expect.objectContaining({
			cardDetails: expect.arrayContaining([
				expect.objectContaining({
					cardDetails: "hashedCardDetails",
					key: "key"
				})
			]),
			credit: 43289,
			email: "testemail@test.com",
			firstName: "testfirstname",
			isDeleted: false,
			lastName: "testlastname",
			password: "testpassword",
			reports: expect.arrayContaining([
				expect.objectContaining({
					report_data: ",,,",
					report_type: "CSV"
				}),
				expect.objectContaining({
					report_data: ",,,",
					report_type: "XML"
				})]),
			role: "User",
			username: "testusername"
		}));
	})
	it('edit', async () => {
		let user = await userWriteRepository.edit("testusername", {
			credit: 30000
		}, {});

		expect(user.credit).toEqual(30000);
	})
	it('edit with tradeMode', async () => {
		let user = await userWriteRepository.edit("testusername", {
			credit: 30000
		}, {
			tradeMode: true
		});

		expect(user.credit).toEqual(73289);
	})
	it('create', async () => {
		let user = await userWriteRepository.create({
			username: "testusername2",
			email: "testemail2@test.com",
			firstName: "testfirstname",
			lastName: "testlastname",
			birthDate: new Date(),
			reports: [
				{
					report_data: ",,,",
					report_date: new Date(),
					report_type: "CSV"
				},
				{
					report_data: ",,,",
					report_date: new Date(),
					report_type: "XML"
				},
			],
			password: "testpassword",
			credit: 30000,
			role: "Admin",
			isDeleted: false,
			cardDetails: [
				{
					cardDetails: "hashedCardDetails",
					key: "key"
				}
			],
			activationDate: new Date()
		});

		expect(user.activationDate).toStrictEqual(expect.any(Date));
		expect(user.birthDate).toStrictEqual(expect.any(Date));
		expect(user.cardDetails![0]).toStrictEqual(expect.objectContaining({
			cardDetails: "hashedCardDetails",
			key: "key"
		}));
		expect(user.credit).toBe(30000);
		expect(user.email).toBe("testemail2@test.com");
		expect(user.firstName).toBe("testfirstname");
		expect(user.lastName).toBe("testlastname");
		expect(user.isDeleted).toBe(false);
		expect(user.reports![0]).toStrictEqual(expect.objectContaining({
			report_data: ",,,",
			report_type: "CSV"
		}));
		expect(user.reports![1]).toStrictEqual(expect.objectContaining({
			report_data: ",,,",
			report_type: "XML"
		}));
	})
})