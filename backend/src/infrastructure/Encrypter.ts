import { injectable } from "inversify";
import IEncrypter from "./IEncrypter";
const crypto = require('crypto');

@injectable()
export default class Encrypter implements IEncrypter {
	private CIPHER_ALGORITHM = 'aes-256-ctr';

    cypher(str: string) : Promise<[string, string]> {
        let sha256 = crypto.createHash('sha256');
		let key = this.createKey();
        sha256.update(key);
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(this.CIPHER_ALGORITHM, sha256.digest(), iv);
        let ciphertext = cipher.update(Buffer.from(str));
        let  encrypted = Buffer.concat([iv, ciphertext, cipher.final()]).toString('base64');
        return Promise.resolve([encrypted, key]);
    }

    decypher(enc: string, key: string) : Promise<string> {
        let sha256 = crypto.createHash('sha256');
        sha256.update(key);
        let input = Buffer.from(enc, 'base64');
        let iv = input.slice(0, 16);
        let decipher = crypto.createDecipheriv(this.CIPHER_ALGORITHM, sha256.digest(), iv);
        let ciphertext = input.slice(16);
        let plaintext = decipher.update(ciphertext) + decipher.final();
        return Promise.resolve(plaintext);
    }

	private createKey () {
		let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%&/()=?^"!|[]{}*+-:.;,_@#<>';
		return str.split('').sort((a, b) => {return Math.random() - 0.5}).join('');
	};
}