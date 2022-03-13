export default interface IStockDto {
	id: string,
	symbol: string,
	name: string,
	value?: Number,
	volume?: Number,
	open?: Number,
	close?: Number
}