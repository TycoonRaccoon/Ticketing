import { NotAuthorizedError, NotFoundError, require_auth } from '@ty-tickets/common'
import { Order } from '../models/order'

import express from 'express'

const router = express.Router()

router.get('/api/orders/:id', require_auth, async (req, res) => {
	const order = await Order.findById(req.params.id).populate('ticket')

	if (!order) throw new NotFoundError()

	if (order.user_id !== req.current_user!.id) throw new NotAuthorizedError()

	res.json(order)
})

export { router as show_order }
