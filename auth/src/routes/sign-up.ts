import { validate_request } from '../middlewares/validate-request'
import { BadRequestError } from '../errors/bad-request'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'

import { body } from 'express-validator'
import express from 'express'

const router = express.Router()

router.post(
	'/api/users/sign-up',
	body('email').isEmail().withMessage('Email must be valid'),
	body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
	validate_request,
	async (req, res) => {
		const { email, password } = req.body

		const existing_user = await User.findOne({ email })
		if (existing_user) throw new BadRequestError('Email in use')

		const user = User.build({ email, password })
		await user.save()

		const user_jwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!)

		req.session = { jwt: user_jwt }

		res.status(201).json(user)
	}
)

export { router as sign_up_router }
