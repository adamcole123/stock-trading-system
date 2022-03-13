export default class Stock {
	constructor(
		public id: string,
		public symbol: string,
		public name: string,
		public value?: Number,
		public volume?: Number,
		public open?: Number,
		public close?: Number
	){

	}
}