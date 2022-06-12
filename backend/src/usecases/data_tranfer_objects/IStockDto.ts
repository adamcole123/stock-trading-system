export default interface IStockDto {
	id?: string,
	symbol?: string,
	name?: string,
	value?: number,
	volume?: number,
	open?: number,
	close?: number,
	gains?: number,
	latest_trade?: Date
}