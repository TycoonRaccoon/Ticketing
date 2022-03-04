import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scrypt_async = promisify(scrypt)

export class Password {
	static async to_hash(password: string) {
		const salt = randomBytes(8).toString('hex')

		const buf = (await scrypt_async(password, salt, 64)) as Buffer

		return `${buf.toString('hex')}.${salt}`
	}

	static async compare(stored_password: string, supplied_password: string) {
		const [hashed_password, salt] = stored_password.split('.')

		const buf = (await scrypt_async(supplied_password, salt, 64)) as Buffer

		return buf.toString('hex') === hashed_password
	}
}
