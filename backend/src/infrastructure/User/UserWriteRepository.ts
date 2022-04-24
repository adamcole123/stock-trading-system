import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import User from './User';
import UserType from '../../usecases/entities/User'
import { injectable } from 'inversify';
import bcrypt from 'bcryptjs';

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
						let errors = {
							username: '',
							email: ''
						};
						if (user.username === userDto.username) {
							errors.username = "User Name already exists";
						} else if (user.email === userDto.email) {
							errors.email = "Email already exists";
						}
						reject(errors);
					} else {
						const newUser = new User({
							username: userDto.username,
							firstName: userDto.firstName,
							lastName: userDto.lastName,
							credit: userDto.credit,
							reports: userDto.reports,
							cardDetails: userDto.cardDetails,
							role: 'User',
							email: userDto.email,
							password: userDto.password
						});

						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(newUser.password, salt, (err, hash) => {
								if (err) throw err;
								newUser.password = hash;
								newUser
									.save()
									.then((user: any) => {
										resolve(user);
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
						reject({ error: err });
					});
			} catch (error) {
				reject(error);
			}
		})
	}

	async edit(username: String, userDto: IUserDto): Promise<IUserDto> {
		let edittedUser = await User.findOneAndUpdate({ username: username }, userDto);
		return edittedUser;
	}

}