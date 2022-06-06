export default interface StockFetchQuery {
	close?: number | Object,
	id?: string | Object,
	name?: string | Object,
	open?: number | Object,
	symbol?: string | Object,
	value?: number | Object,
	volume?: number | Object,
	latest_trade?: number | Object,
	gains?: number | Object
}