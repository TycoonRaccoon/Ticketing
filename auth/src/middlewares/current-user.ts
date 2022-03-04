import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
	id: string
	email: string
}

declare global {
	namespace Express {
		interface Request {
			current_user?: UserPayload
		}
	}
}

export const current_user = (req: Request, res: Response, next: NextFunction) => {
	if (!req.session?.jwt) return next()

	try {
		const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload
		req.current_user = payload
	} catch (error) {}

	next()
}
