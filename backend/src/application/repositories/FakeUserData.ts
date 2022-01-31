import IUserDto from "../../usecases/data_tranfer_objects/IUserDto"
import bcrypt from 'bcryptjs';
import User from "../../usecases/entities/User";

let users: IUserDto[] = [
	{
		id: '1',
		email: 'test1email@test.com',
		firstName: 'test1fname',
		lastName: 'test1lname',
		username: 'test1username',
		password: bcrypt.hashSync('test1password', bcrypt.genSaltSync(10)),
		birthDate: new Date('19980506'),
		reports: [
			{
				id: '1',
				report_data: ',,,',
				report_type: 1
			},
			{
				id: '2',
				report_data: '<xml></xml>',
				report_type: 0
			},
			{
				id: '3',
				report_data: ',,,',
				report_type: 1
			}
		]
	},
	{
		id: '2',
		email: 'test2email@test.com',
		firstName: 'test2fname',
		lastName: 'test2lname',
		username: 'test2username',
		password: bcrypt.hashSync('test2password', bcrypt.genSaltSync(10)),
		birthDate: new Date('19920206'),
		reports: [
			{
				id: '1',
				report_data: ',,,',
				report_type: 1
			},
			{
				id: '2',
				report_data: '<xml></xml>',
				report_type: 0
			},
			{
				id: '3',
				report_data: ',,,',
				report_type: 1
			}
		]
	}
]

export default users;