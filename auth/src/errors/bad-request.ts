import { CustomError } from './custom'

export class BadRequestError extends CustomError {
	status_code = 400

	constructor(public message: string) {
		super(message)
	}

	serialize_errors() {
		return [{ message: this.message }]
	}
}
