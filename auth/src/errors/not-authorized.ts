import { CustomError } from './custom'

export class NotAuthorizedError extends CustomError {
	status_code = 401

	constructor() {
		super('Not authorized')
	}

	serialize_errors() {
		return [{ message: 'Not authorized' }]
	}
}
