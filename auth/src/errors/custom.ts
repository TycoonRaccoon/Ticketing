type serialized_errors = {
	message: string
	field?: string
}[]

export abstract class CustomError extends Error {
	abstract status_code: number
	abstract serialize_errors(): serialized_errors

	constructor(message: string) {
		super(message)
	}
}
