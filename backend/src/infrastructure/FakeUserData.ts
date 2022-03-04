import bcrypt from 'bcryptjs';
import Report from '../usecases/entities/Report';
import User from '../usecases/entities/User';

let users: User[] = [
	new User(
		"test1_username", 
		"test1email@test.com", 
		"test1fname", 
		"test1lname", 
		new Date(), [
			new Report("report1id", ",,,", 1),
			new Report("report2id", ",,,", 0),
			new Report("report3id", ",,,", 1),
			new Report("report4id", ",,,", 1)
		], 
		"test1_id", 
		bcrypt.hashSync('test1password', bcrypt.genSaltSync(10))
	),
	new User(
		"test2_username", 
		"test2email@test.com", 
		"test2fname", 
		"test2lname", 
		new Date(), [
			new Report("report1id", ",,,", 1),
			new Report("report2id", ",,,", 0),
			new Report("report3id", ",,,", 1),
			new Report("report4id", ",,,", 1)
		], 
		"test2_id", 
		bcrypt.hashSync('test2password', bcrypt.genSaltSync(10))
	)
]

export default users;