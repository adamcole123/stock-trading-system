export default class Stock {
	readonly gains: number | undefined = this.getGains();
	
	constructor(
		public id: string,
		public symbol: string,
		public name: string,
		public value?: number,
		public volume?: number,
		public open?: number,
		public close?: number
	){
		this.gains = this.getGains();
	}

	public getGains(): number | undefined {
		return this.value && this.open ? this.value!-this.open! : undefined;
	}
}