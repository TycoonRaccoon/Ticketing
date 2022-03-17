import { require_auth, validate_request } from '@ty-tickets/common'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created'
import { nats_wrapper } from '../nats-wrapper'
import { Ticket } from '../models/ticket'
import { body } from 'express-validator'

import express from 'express'

const router = express.Router()

router.post(
	'/api/tickets',
	require_auth,
	body('title').notEmpty().withMessage('Title is required'),
	body('price').isFloat({ gt: 0 }).withMessage('Price must be grater than 0'),
	validate_request,
	async (req, res) => {
		const { title, price } = req.body

		const ticket = Ticket.build({ title, price, user_id: req.current_user!.id })
		await ticket.save()

		new TicketCreatedPublisher(nats_wrapper.client).publish({ id: ticket.id, title: ticket.title, price: ticket.price, user_id: ticket.user_id })

		res.status(201).json(ticket)
	}
)

export { router as create_ticket }
