import ISendEmailUseCase from "../Email/ISendEmailUseCase";
import SendEmailUseCase from '../Email/SendEmailUseCase';
import { describe, expect, it } from "vitest";

describe('Email tests', () => {
	it('Send email use case', async () => {
		const sendEmailUseCase: ISendEmailUseCase = new SendEmailUseCase();

		let email = await sendEmailUseCase.invoke({
			from: '"Fred Foo 👻" <foo@example.com>', // sender address
			to: ["bar@example.com", "baz@example.com"], // list of receivers
			subject: "Test Subject", // Subject line
			bodyText: "Test body text", // plain text body
			bodyHtml: "<b>Test body html</b>", // html body
		})

		expect(email).toStrictEqual(expect.objectContaining({
			"bodyHtml": "<b>Test body html</b>",
			"bodyText": "Test body text",
			"from": "\"Fred Foo 👻\" <foo@example.com>",
			"subject": "Test Subject",
			"to": ["bar@example.com", "baz@example.com"]
		}))
	})
})