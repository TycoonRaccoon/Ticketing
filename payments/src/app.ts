import 'express-async-errors'
import express from 'express'
import cookie_session from 'cookie-session'

import { current_user, error_handler, NotFoundError } from '@ty-tickets/common'
import { create_charge } from './routes/new'

const app = express()

app.set('trust proxy', true)

app.use(express.json())
app.use(
	cookie_session({
		signed: false,
		secure: process.env.NODE_ENV !== 'test'
	})
)

app.use(current_user, create_charge)

app.all('*', () => {
	throw new NotFoundError()
})

app.use(error_handler)

export { app }
