import IUserDto from '../data_tranfer_objects/IUserDto';
export default interface IGetUserPortfolioUseCase {
	invoke(userDto: IUserDto): Promise<{[key: string]: number}>;
}