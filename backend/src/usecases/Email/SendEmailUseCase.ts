import IEmailDto from "../data_tranfer_objects/IEmailDto";
import ISendEmailUseCase from "./ISendEmailUseCase";
import nodemailer from 'nodemailer';
import { injectable } from "inversify";

export default class SendEmailUseCase implements ISendEmailUseCase {
	async invoke(email: IEmailDto): Promise<IEmailDto> {
		
		try {
			// Generate test SMTP service account from ethereal.email
			// Only needed if you don't have a real mail account for testing
			let testAccount = await nodemailer.createTestAccount();
	
			// create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
				host: "smtp.ethereal.email",
				port: 587,
				secure: false, // true for 465, false for other ports
				auth: {
					user: testAccount.user, // generated ethereal user
					pass: testAccount.pass, // generated ethereal password
				},
			});
			
			// send mail with defined transport object
			let info = await transporter.sendMail({
				from: email.from, // sender address
				to: email.to.reduce((prevAddress, currentAddress) => prevAddress + `, ${currentAddress}`), // list of receivers
				subject: email.subject, // Subject line
				text: email.bodyText, // plain text body
				html: email.bodyHtml, // html body
			});

			console.log("Message sent: %s", info.messageId);
			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	
			// Preview only available when sending through an Ethereal account
			console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

			return Promise.resolve(email);
		} catch (error: any) {
			return Promise.reject(error);	
		}
	}

}