import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { nats_wrapper } from '../nats-wrapper'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated'
import { validate_request, require_auth, NotFoundError, NotAuthorizedError, BadRequestError } from '@ty-tickets/common'

import express from 'express'

const router = express.Router()

router.patch(
	'/api/tickets/:id',
	require_auth,
	body('title').notEmpty().withMessage('Title is required'),
	body('price').isFloat({ gt: 0 }).withMessage('Price must be grater than 0'),
	validate_request,
	async (req, res) => {
		const ticket = await Ticket.findById(req.params.id)

		if (!ticket) throw new NotFoundError()
		if (ticket.order_id) throw new BadRequestError('Cannot edit a reserved ticket')
		if (ticket.user_id != req.current_user!.id) throw new NotAuthorizedError()

		ticket.set({ title: req.body.title, price: req.body.price })
		await ticket.save()

		new TicketUpdatedPublisher(nats_wrapper.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			user_id: ticket.user_id,
			version: ticket.version
		})

		res.json(ticket)
	}
)

export { router as update_ticket }
