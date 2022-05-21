export default interface IEncrypter {
	cypher(str: string): Promise<[string, string]>;
	decypher(enc: string, key: string): Promise<string>;
}