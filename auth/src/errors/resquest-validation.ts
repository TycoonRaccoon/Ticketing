import { ValidationError } from 'express-validator'
import { CustomError } from './custom'

export class RequestValidationError extends CustomError {
	status_code = 400

	constructor(private errors: ValidationError[]) {
		super('Invalid request parameters')
	}

	serialize_errors() {
		return this.errors.map(error => ({
			message: error.msg,
			field: error.param
		}))
	}
}
