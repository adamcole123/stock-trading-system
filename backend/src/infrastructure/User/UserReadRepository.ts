import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import User from './User';
import { injectable } from 'inversify';
import cardDetailsSchema from './CardDetailsSchema';

@injectable()
export default class UserReadRepository implements IUserReadOnlyRepository {
	async fetchAll(): Promise<IUserDto[]> {
		let users = await User.find({});
		return users.map(user => {
			return {
				id: user._id.toString(),
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				birthDate: user.birthDate,
				reports: user.reports.map((report: any) => {
					return {
						id: report._id.toString(),
						report_date: report.report_date,
						report_data: report.report_data,
						report_type: report.report_type
					}
				}),
				credit: user.credit,
				role: user.role,
				isDeleted: user.isDeleted,
				cardDetails: user.cardDetails.map((card: any) => {
					return { ...card._doc }
				}),
				password: user.password,
				activationDate: user.activationDate,
				banUntil: user.banUntil
			}
		});
	}

	fetch(userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			let user: any;
			try {
				if (userDto.id)
					user = await User.findById(userDto.id);
				if (userDto.username)
					user = await User.findOne({ username: userDto.username });
				if (userDto.email)
					user = await User.findOne({ email: userDto.email });
			} catch (err) {
				return reject("No user with that username, id, or email exists");
			}

			if (user) {
				userDto = {
					id: user._id,
					username: user.username,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					birthDate: user.birthDate,
					reports: user.reports.map((report: any) => {
						return {
							id: report._id.toString(),
							report_date: report.report_date,
							report_data: report.report_data,
							report_type: report.report_type
						}
					}),
					credit: user.credit,
					role: user.role,
					isDeleted: user.isDeleted,
					cardDetails: user.cardDetails.map((card: any) => {
						return { ...card._doc }
					}),
					password: user.password,
					activationDate: user.activationDate,
					banUntil: user.banUntil
				}

				return resolve(userDto!);
			}

			return reject("Could not find user");
		})
	}

}