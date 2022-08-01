import { injectable, inject } from "inversify";
import SendRealEmailUseCase from "../../../../src/usecases/Email/SendRealEmailUseCase";
import ISendEmailUseCase from '../../../../src/usecases/Email/ISendEmailUseCase';
import SendEmailUseCase from "../../../../src/usecases/Email/SendEmailUseCase";

@injectable()
export default class FakeEmailServiceLocator {
	public GetSendEmailUseCase(): ISendEmailUseCase {
		return new class MockSendEmailUseCase {
			invoke () {
				return Promise.resolve({
					to: [''],
					from: '',
					subject: '',
					bodyText: '',
					bodyHtml: ''
				});
			}
		};
	}
}