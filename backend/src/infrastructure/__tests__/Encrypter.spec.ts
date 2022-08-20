import 'reflect-metadata';
import { describe, expect, it } from "vitest";
import Encrypter from '../Encrypter';
import IEncrypter from '../IEncrypter';
describe('Encrypter tests', () => {
	let encrypter: IEncrypter = new Encrypter();

	it('Encrypt', () => {
		//Arrange
		let dataToEncrypt = 'TestString';

		//Act
		let encryptedData = encrypter.cypher(dataToEncrypt);

		//Assert
		expect(encryptedData[0]).toStrictEqual(expect.any(String));
		expect(encryptedData[1]).toStrictEqual(expect.any(String));
	})

	it('Decrypt', () => {
		//Arrange
		let dataToDecrypt = encrypter.cypher('TestString');

		//Act
		let decryptedData = encrypter.decypher(dataToDecrypt[0], dataToDecrypt[1]);

		//Assert
		expect(decryptedData).toBe('TestString');
	})
})