import ISendEmailUseCase from './ISendEmailUseCase';
import nodemailer, { TransportOptions } from 'nodemailer';
import IEmailDto from '../data_tranfer_objects/IEmailDto';
import dotenv from 'dotenv';
import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import { google } from 'googleapis'
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default class SendReadEmailUseCase implements ISendEmailUseCase {
	private oAuth2Client;
	/**
	 *
	 */
	constructor() {
		dotenv.config();
		this.oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
		this.oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
	}
	async invoke(email: IEmailDto): Promise<IEmailDto> {
		try {
			const accessToken = (await this.oAuth2Client.getAccessToken()).token;

			const transporter = nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 465,
				secure: true,
				auth: {
				  type: 'OAuth2',
				  user: process.env.EMAIL_USER,
				  clientId: process.env.CLIENT_ID,
				  clientSecret: process.env.CLIENT_SECRET,
				  refreshToken: process.env.REFRESH_TOKEN,
				  accessToken: accessToken,
				},
			  } as SMTPConnection.Options);

			// send mail with defined transport object
			let info = await transporter.sendMail({
				from: 'Stock Trading System 💵 <stocktradingsystem1@gmail.com>', // sender address
				to: email.to.reduce((prevAddress, currentAddress) => prevAddress + `, ${currentAddress}`), // list of receivers
				subject: email.subject, // Subject line
				text: email.bodyText, // plain text body
				html: email.bodyHtml, // html body
			});

			console.log("Message sent: %s", info);
			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

			return Promise.resolve(email);
		} catch (error: any) {
			return Promise.reject(error);
		}
	}
}