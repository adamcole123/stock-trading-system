import { objectContainsKey } from 'jest-mock-extended';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import 'reflect-metadata';
import config from '../../../test/utils/config';
import Stock from '../Stock/Stock';
import StockReadRepository from '../Stock/StockReadRepository';
import StockWriteRepository from '../Stock/StockWriteRepository';

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
			"name": "test1name",
			"open": 490,
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
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
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
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch gainsMode 0', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name",
			gains: 9999.99
		}, { gainsMode: 0 });

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch gainsMode 1', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name",
			gains: 10
		}, { gainsMode: 1 });

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch gainsMode 2', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name",
			gains: 0
		}, { gainsMode: 2 });

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch valueMode 0', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name",
			value: 9999.99
		}, { valueMode: 0 });

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch valueMode 1', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name",
			value: 500
		}, { valueMode: 1 });

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch valueMode 2', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name",
			value: 0
		}, { valueMode: 2 });

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch volumeMode 0', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name",
			volume: 9999.99
		}, { volumeMode: 0 });

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch volumeMode 1', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name",
			volume: 500
		}, { volumeMode: 1 });

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('fetch volumeMode 2', async () => {
		let stocks = await stockReadRepository.fetch({
			name: "test1name",
			volume: 0
		}, { volumeMode: 2 });

		let stock = stocks[0];

		expect(stock.close).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.gains).toStrictEqual(expect.objectContaining({ "value": 10 }));
		expect(stock.name).toEqual("test1name");
		expect(stock.open).toStrictEqual(expect.objectContaining({
			value: 490
		}));
		expect(stock.symbol).toEqual("TEST1SYMBOL");
		expect(stock.value).toStrictEqual(expect.objectContaining({
			value: 500
		}));
		expect(stock.volume).toEqual(500);
	})
	it('edit', async () => {
		let stockToTest = await Stock.findOne({ name: "test1name" });
		let newDate = new Date();
		let stock = await stockWriteRepository.edit({
			id: stockToTest!._id.toString(),
			value: 5000,
			symbol: "TST",
			latest_trade: newDate,
			name: "NewTest",
			open: 50000,
			close: 40000,
			volume: 20
		});

		expect(stock[0].value).toStrictEqual(expect.objectContaining({
			"_bsontype": "Double",
			"value": 5000
		}));
		expect(stock[0].open).toStrictEqual(expect.objectContaining({
			"_bsontype": "Double",
			"value": 50000
		}));
		expect(stock[0].close).toStrictEqual(expect.objectContaining({
			"_bsontype": "Double",
			"value": 40000
		}));
		expect(stock[0].symbol).toEqual("TST");
		expect(stock[0].name).toEqual("NewTest");
		expect(stock[0].volume).toEqual(20);
		expect(stock[0].latest_trade).toEqual(newDate);
	})
	it('edit with tradeMode', async () => {
		let stockToTest = await Stock.findOne({ name: "test1name" });
		let newDate = new Date();
		let stock = await stockWriteRepository.edit({
			id: stockToTest!._id.toString(),
			volume: 20
		}, { tradeMode: true });

		expect(stock[0].volume).toEqual(520);
	})
	it('create', async () => {
		let stock = await stockWriteRepository.create({
			"close": 600,
			"gains": 600,
			"name": "test2name",
			"open": 600,
			"symbol": "test2symbol",
			"value": 600,
			"volume": 600,
		});

		expect(stock.close).toEqual(600);
		expect(stock.gains).toEqual(600);
		expect(stock.name).toEqual("test2name");
		expect(stock.open).toEqual(600);
		expect(stock.symbol).toEqual("test2symbol");
		expect(stock.value).toEqual(600);
		expect(stock.volume).toEqual(600);
	})
})