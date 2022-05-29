import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { model } from 'mongoose';
import 'reflect-metadata';
import IStockDto from 'src/usecases/data_tranfer_objects/IStockDto';
import config from '../../../test/utils/config';
import Stock from '../Stock/Stock';
import Trade from '../Trade/Trade';
import TradeReadOnlyRepository from '../Trade/TradeReadOnlyRepository';
import TradeWriteOnlyRepository from '../Trade/TradeWriteOnlyRepository';
import User from '../User/User';


jest.useRealTimers();

describe('Trade Repositories', () => {
	let tradeReadRepository = new TradeReadOnlyRepository();
	let tradeWriteRepository = new TradeWriteOnlyRepository();

	beforeAll(async () => {
		if (config.Memory) { // Config to decided if an mongodb-memory-server instance should be used
			// it's needed in global space, because we don't want to create a new instance every test-suite
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

		let stock = await Stock.create({
			"close": 500,
			"gains": 500,
			"name": "test1name",
			"open": 500,
			"symbol": "test1symbol",
			"value": 500,
			"volume": 500,
		})

		let user = await User.create({
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

		await User.create({
			username: "test2username",
			email: "test2email@test.com",
			firstName: "test2firstname",
			lastName: "test2lastname",
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
			password: "test2password",
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

		await Trade.create({
			user_id: user._id.toString(),
			stock_id: stock._id.toString(),
			stock_amount: 50,
			stock_value: 345.6,
			time_of_trade: new Date(),
			trade_type: "Buy",
		})
	})

	it('fetch', async () => {
		let stock = await Stock.findOne({ value: 500 })
		let trades = await tradeReadRepository.fetch({
			stock_id: stock?._id.toString()
		});

		let trade = trades[0];

		expect(trade.stock_value).toEqual(345.6);
	});

	it('fetch populateStocks true', async () => {
		let stock = await Stock.findOne({ value: 500 })
		let trades = await tradeReadRepository.fetch({
			stock_id: stock?._id.toString()
		}, true);

		let trade = trades[0];
		let populatedStock = <IStockDto>trade.stock_id;

		expect(populatedStock.close).toStrictEqual(expect.objectContaining({
			value: 500
		})); 
		expect(populatedStock.name).toEqual("test1name"); 
		expect(populatedStock.open).toStrictEqual(expect.objectContaining({
			value: 500
		})); 
		expect(populatedStock.symbol).toEqual("test1symbol"); 
		expect(populatedStock.value).toStrictEqual(expect.objectContaining({
			value: 500
		})); 
		expect(populatedStock.volume).toEqual(500);
	});

	it('edit', async () => {
		let tradeToTest = await Trade.findOne({ stock_value: 345.6 });
		let trade = await tradeWriteRepository.edit({
			id: tradeToTest!._id.toString(),
			stock_value: 5000
		});

		expect(trade.stock_value).toEqual(345.6);
	});

	it('create', async () => {
		let user = await User.findOne({ username: "test2username" });
		let stock = await Stock.findOne({ value: 500 });
		let trade = await tradeWriteRepository.create({
			user_id: user._id.toString(),
			stock_id: stock!._id.toString(),
			stock_amount: 50,
			stock_value: 345.6,
			time_of_trade: new Date(),
			trade_type: "Buy",
		});

		expect(trade.stock_amount).toEqual(50);
		expect(trade.stock_id).toEqual(stock!._id);
		expect(trade.stock_value).toEqual(345.6);
		expect(trade.time_of_trade).toEqual(expect.any(Date));
		expect(trade.trade_status).toEqual("Pending");
		expect(trade.trade_type).toEqual("Buy");
		expect(trade.user_id).toEqual(user._id);
	});
});