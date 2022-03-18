export default interface IStockDto {
	id: string,
	symbol: string,
	name: string,
	value?: number,
	volume?: number,
	open?: number,
	close?: number,
	readonly gains?: number
}