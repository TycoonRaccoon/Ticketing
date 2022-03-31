import { require_auth, validate_request, NotFoundError, BadRequestError, OrderStatus } from '@ty-tickets/common'
import { OrderCreatedPublisher } from '../events/publishers/created'
import { nats_wrapper } from '../nats-wrapper'
import { Ticket } from '../models/ticket'
import { body } from 'express-validator'
import { Order } from '../models/order'

import express from 'express'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 1 * 60

router.post(
	'/api/orders',
	require_auth,
	body('ticket_id').notEmpty().withMessage('ticket_id must be provided'),
	validate_request,
	async (req, res) => {
		const { ticket_id } = req.body

		const ticket = await Ticket.findById(ticket_id)
		if (!ticket) throw new NotFoundError()

		const is_reserved = await ticket.isReserved()
		if (is_reserved) throw new BadRequestError('Ticket is already reserved')

		const expiration = new Date()
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

		const order = Order.build({ user_id: req.current_user!.id, status: OrderStatus.Created, expires_at: expiration, ticket })
		await order.save()

		new OrderCreatedPublisher(nats_wrapper.client).publish({
			id: order.id,
			status: order.status,
			user_id: order.user_id,
			expires_at: order.expires_at.toISOString(),
			version: order.version,
			ticket: {
				id: ticket.id,
				price: ticket.price
			}
		})

		res.status(201).json(order)
	}
)

export { router as create_order }
