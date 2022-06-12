export default interface IEncrypter {
	cypher(str: string): [string, string];
	decypher(enc: string, key: string): string;
}