import IEmailDto from "../data_tranfer_objects/IEmailDto";

export default interface ISendEmailUseCase {
	invoke(email: IEmailDto) : Promise<IEmailDto>
}