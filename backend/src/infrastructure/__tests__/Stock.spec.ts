import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import 'reflect-metadata';
import config from '../../../test/utils/config';
import Stock from '../Stock/Stock';
import StockReadRepository from '../Stock/StockReadRepository';
import StockWriteRepository from '../Stock/StockWriteRepository';


jest.useRealTimers();

describe('Stock Repositories', () => {

	let stockReadRepository = new StockReadRepository();
	let stockWriteRepository = new StockWriteRepository();

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

		await Stock.create({
			"close": 500,
			"gains": 500,
			"name": "test1name",
			"open": 500,
			"symbol": "test1symbol",
			"value": 500,
			"volume": 500,
		})
	})

	it('fetchAll', async () => {
		let stocks = await stockReadRepository.fetchAll();

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toEqual("0.00");
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.symbol).toEqual("test1symbol");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name"
		});

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toEqual("0.00");
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.symbol).toEqual("test1symbol");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('edit', async () => {
		let stockToTest = await Stock.findOne({ name: "test1name"});
		let stock = await stockWriteRepository.edit({
			id: stockToTest!._id.toString(),
			value: 5000
		});

		expect(stock[0].value).toStrictEqual(expect.objectContaining({
			value: 5000
		}));
	})
	// it('create', async () => {
	// 	let stock = await stockWriteRepository.create({
	// 		"close": 600,
	// 		"gains": 600,
	// 		"name": "test2name",
	// 		"open": 600,
	// 		"symbol": "test2symbol",
	// 		"value": 600,
	// 		"volume": 600,
	// 	});

	// 	expect(stock.close).toStrictEqual(expect.objectContaining({
	// 		value: 600
	// 	}));
	// 	expect(stock.gains).toEqual(600);
	// 	expect(stock.name).toEqual("test2name");
	// 	expect(stock.open).toStrictEqual(expect.objectContaining({
	// 		value: 600
	// 	}));
	// 	expect(stock.symbol).toEqual("test2symbol");
	// 	expect(stock.value).toStrictEqual(expect.objectContaining({
	// 		value: 600
	// 	}));
	// 	expect(stock.volume).toEqual(600);
	// })
})