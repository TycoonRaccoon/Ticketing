import { NextFunction, Request, Response } from 'express'
import { NotAuthorizedError } from '../errors/not-authorized'

export const require_auth = (req: Request, res: Response, next: NextFunction) => {
	if (!req.current_user) throw new NotAuthorizedError()

	next()
}
