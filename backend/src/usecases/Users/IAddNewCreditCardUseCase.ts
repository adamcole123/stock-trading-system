import ICreditCardDto from "../data_tranfer_objects/ICreditCardDto";
import IUserDto from '../data_tranfer_objects/IUserDto';

export default interface IAddNewCreditCardUseCase {
	invoke(creditCardDto: ICreditCardDto, userId: string): Promise<IUserDto>
}