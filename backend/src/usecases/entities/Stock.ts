export default class Stock {
	constructor(
		public id: string,
		public symbol: string,
		public name: string,
		public value?: number,
		public volume?: number,
		public open?: number,
		public close?: number,
		public latest_trade?: Date,
		public gains?: number
	){

	}
}