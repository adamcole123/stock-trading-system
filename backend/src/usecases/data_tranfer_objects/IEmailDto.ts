export default interface IEmailDto {
	to: string[],
	from: string,
	subject: string,
	bodyText: string,
	bodyHtml: string
}