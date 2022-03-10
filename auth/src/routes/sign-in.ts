import { validate_request, BadRequestError } from '@ty-tickets/common'
import { Password } from '../services/password'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'

import { body } from 'express-validator'
import express from 'express'

const router = express.Router()

router.post(
	'/api/users/sign-in',
	body('email').isEmail().withMessage('Email must be valid'),
	body('password').trim().notEmpty().withMessage('You must supply a password'),
	validate_request,
	async (req, res) => {
		const { email, password } = req.body

		const existing_user = await User.findOne({ email })
		if (!existing_user) throw new BadRequestError('Invalid credentials')

		const passwords_match = await Password.compare(existing_user.password, password)

		if (!passwords_match) throw new BadRequestError('Invalid credentials')

		const user_jwt = jwt.sign({ id: existing_user.id, email: existing_user.email }, process.env.JWT_KEY!)

		req.session = { jwt: user_jwt }

		res.status(200).json(existing_user)
	}
)

export { router as sign_in_router }
