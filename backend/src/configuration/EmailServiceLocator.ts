import { injectable, inject } from "inversify";
import ISendEmailUseCase from '../usecases/Email/ISendEmailUseCase';
import SendEmailUseCase from "../usecases/Email/SendEmailUseCase";

@injectable()
export default class EmailServiceLocator {
	public GetSendEmailUseCase(): ISendEmailUseCase {
		return new SendEmailUseCase();
	}
}