import { require_auth } from '@ty-tickets/common'
import { Order } from '../models/order'

import express from 'express'

const router = express.Router()

router.get('/api/orders', require_auth, async (req, res) => {
	const orders = await Order.find({ user_id: req.current_user!.id }).populate('ticket')

	res.json(orders)
})

export { router as index_order }
