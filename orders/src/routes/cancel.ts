import { NotAuthorizedError, NotFoundError, OrderStatus } from '@ty-tickets/common'
import { OrderCancelledPublisher } from '../events/publishers/cancelled'
import { nats_wrapper } from '../nats-wrapper'
import { Order } from '../models/order'

import express from 'express'

const router = express.Router()

router.patch('/api/orders/:id/cancel', async (req, res) => {
	const order = await Order.findById(req.params.id).populate('ticket')

	if (!order) throw new NotFoundError()
	if (order.user_id !== req.current_user!.id) throw new NotAuthorizedError()

	order.status = OrderStatus.Cancelled
	await order.save()

	new OrderCancelledPublisher(nats_wrapper.client).publish({
		id: order.id,
		ticket: {
			id: order.ticket.id
		}
	})

	res.json(order)
})

export { router as cancel_order }
