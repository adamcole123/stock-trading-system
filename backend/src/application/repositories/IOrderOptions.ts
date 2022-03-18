import OrderMode from './OrderMode';

export default interface IOrderOptions<T> {
	orderBy: T; // I want this to be the value of any property in T
	orderDirection: OrderMode;
}