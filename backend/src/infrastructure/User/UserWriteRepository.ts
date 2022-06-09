import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import User from './User';
import { injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import UserEditOptions from '../../application/repositories/UserEditOptions';

@injectable()
export default class UserWriteRepository implements IUserWriteOnlyRepository {
	create(userDto: IUserDto): Promise<IUserDto> {
		return new Promise(async (resolve, reject) => {
			try {
				User.findOne({
					$or: [{
						email: userDto.email
					}, {
						username: userDto.username
					}]
				}).then(user => {
					if (user) {
						let errors = ""
						if (user.username === userDto.username) {
							errors = `${errors}User Name already exists. `;
						}
						if (user.email === userDto.email) {
							errors = `${errors}Email already exists. `;
						}
						reject(errors);
					} else {
						const newUser = new User({
							username: userDto.username,
							firstName: userDto.firstName,
							lastName: userDto.lastName,
							credit: userDto.credit,
							reports: userDto.reports,
							birthDate: userDto.birthDate,
							cardDetails: userDto.cardDetails,
							role: 'User',
							email: userDto.email,
							password: userDto.password,
							activationDate: userDto.activationDate
						});

						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(newUser.password, salt, (err, hash) => {
								if (err) throw err;
								newUser.password = hash;
								User.create(newUser)
									.then((user: any) => {
										userDto = {
											id: user._id,
											username: user.username,
											email: user.email,
											firstName: user.firstName,
											lastName: user.lastName,
											birthDate: user.birthDate,
											reports: user.reports,
											credit: user.credit,
											role: user.role,
											isDeleted: user.isDeleted,
											cardDetails: user.cardDetails,
											activationDate: user.activationDate
										}
										resolve(userDto);
									})
									.catch((err: any) => {
										console.log(err);
										reject(err);
									});
							});
						});
					}
				})
					.catch(err => {
						reject(err);
					});
			} catch (error) {
				reject(error);
			}
		})
	}

	async edit(username: String, userDto: IUserDto, userEditOptions: UserEditOptions): Promise<IUserDto> {
		return new Promise((resolve, reject) => {
			User.findOne({ username: username })
			.then(user => {
				try{
					let newCredit: number;
					if(userEditOptions.tradeMode !== undefined){
						newCredit = userEditOptions.tradeMode === true ? user.credit + userDto.credit : userDto!.credit;
						user.credit = newCredit;
					} else {
						user = Object.assign(user, userDto);
					}
					
					user.save();
	
					resolve({
						id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
						credit: user.credit,
						birthDate: user.birthDate,
						email: user.email,
						reports: user.reports,
						role: user.role,
						username: user.username,
						cardDetails: user.cardDetails,
						activationDate: user.activationDate
					});
				} catch (e) {
					return reject("Couldn't edit user: " + e);
				}
			})
			.catch(err => {
				reject(err);
			})
		})
	}

}