import cookie_session from 'cookie-session'
import express from 'express'
import 'express-async-errors'

import { current_user, error_handler, NotFoundError } from '@ty-tickets/common'

import { cancel_order } from './routes/cancel'
import { create_order } from './routes/new'
import { show_order } from './routes/show'
import { index_order } from './routes'

const app = express()

app.set('trust proxy', true)

app.use(express.json())
app.use(
	cookie_session({
		signed: false,
		secure: process.env.NODE_ENV !== 'test'
	})
)

app.use(current_user, cancel_order, create_order, show_order, index_order)

app.all('*', () => {
	throw new NotFoundError()
})

app.use(error_handler)

export { app }
