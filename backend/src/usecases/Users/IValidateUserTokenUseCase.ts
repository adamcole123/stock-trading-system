import { JwtPayload } from 'jsonwebtoken';
import IUserDto from '../data_tranfer_objects/IUserDto';
export default interface IValidateUserTokenUseCase {
	invoke(token: string): Promise<string | JwtPayload>;
}