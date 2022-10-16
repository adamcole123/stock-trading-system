import ICreditCardDto from "src/usecases/data_tranfer_objects/ICreditCardDto";
import IReportDto from "src/usecases/data_tranfer_objects/IReportDto";
import IUserDto from "../../usecases/data_tranfer_objects/IUserDto";
import UserEditOptions from "./UserEditOptions";

export default interface IUserWriteOnlyRepository {
	create(userDto: IUserDto): Promise<IUserDto>;
	edit(username: string, userDto: IUserDto, userEditOptions: UserEditOptions): Promise<IUserDto>;
	addReport(username: String, report: IReportDto): Promise<IUserDto>;
	addNewCard(username: String, card: any): Promise<IUserDto>;
}