import { CustomError } from './custom'

export class NotFoundError extends CustomError {
	status_code = 404

	constructor() {
		super('Route not found')
	}

	serialize_errors() {
		return [{ message: 'Not found' }]
	}
}
