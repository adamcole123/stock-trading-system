import ITradeDto from "../data_tranfer_objects/ITradeDto";
import BuyStocksUseCase from "../Trades/BuyStocksUseCase";
import IBuyStocksUseCase from "../Trades/IBuyStocksUseCase";

describe("Trade Tests", () => {
	it("Buy stocks use case", async () => {
		//Arrange
		let buyStocksUseCase: IBuyStocksUseCase;
		let tradeDto: ITradeDto;

		buyStocksUseCase = new BuyStocksUseCase(stockWriteOnlyRepository, tradeWriteOnlyRepository);
		
		//Act
		tradeDto = await buyStocksUseCase.invoke({
			stockid: "testid1",
			userid: "testid1",
			quantity: 50
		});

		let stockDto = stockReadOnlyRepository.fetch({
			symbol: "test"
		})

		//Assert
		expect(tradeDto.stockid).toBe('test')
		expect(tradeDto.quantity).toBe(50)
		expect(stockDto.volume).toBe(5950)
	})
})