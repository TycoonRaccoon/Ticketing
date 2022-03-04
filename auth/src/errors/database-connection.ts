import { CustomError } from './custom'

export class DatabaseConnectionError extends CustomError {
	reason = 'Error connecting to database'
	status_code = 500

	constructor() {
		super('Error connecting to DB')
	}

	serialize_errors() {
		return [{ message: this.reason }]
	}
}
