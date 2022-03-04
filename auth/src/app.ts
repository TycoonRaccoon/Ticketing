import 'express-async-errors'
import express from 'express'
import cookie_session from 'cookie-session'

import { error_handler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found'

import { current_user_router } from './routes/current-user'
import { sign_out_router } from './routes/sign-out'
import { sign_up_router } from './routes/sign-up'
import { sign_in_router } from './routes/sign-in'

const app = express()

app.set('trust proxy', true)

app.use(express.json())
app.use(
	cookie_session({
		signed: false,
		secure: process.env.NODE_ENV !== 'test'
	})
)

app.use(current_user_router, sign_out_router, sign_up_router, sign_in_router)

app.all('*', () => {
	throw new NotFoundError()
})

app.use(error_handler)

export { app }
