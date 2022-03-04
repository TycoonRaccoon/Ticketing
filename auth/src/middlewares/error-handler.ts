import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../errors/custom'

export const error_handler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof CustomError) return res.status(err.status_code).json({ erros: err.serialize_errors() })

	res.status(500).json({ errors: [{ message: 'Something went wrong' }] })
}
