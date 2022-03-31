import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, require_auth, validate_request } from '@ty-tickets/common'
import { body } from 'express-validator'
import { Order } from '../models/order'
import { stripe } from '../stripe'

import express from 'express'
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created'
import { nats_wrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
	'/api/payments',
	require_auth,
	body('token').notEmpty().withMessage('token must be provided'),
	body('order_id').notEmpty().withMessage('order_id must be provided'),
	validate_request,
	async (req, res) => {
		const { token, order_id } = req.body

		const order = await Order.findById(order_id)
		if (!order) throw new NotFoundError()
		if (order.user_id !== req.current_user!.id) throw new NotAuthorizedError()
		if (order.status === OrderStatus.Cancelled) throw new BadRequestError('Cannot pay for a cancelled order')

		const charge = await stripe.charges.create({
			currency: 'usd',
			amount: order.price * 100,
			source: token
		})

		const payment = Payment.build({
			order_id,
			stripe_id: charge.id
		})
		await payment.save()

		new PaymentCreatedPublisher(nats_wrapper.client).publish({
			id: payment.id,
			order_id: payment.order_id,
			stripe_id: payment.stripe_id
		})

		res.status(201).json({ id: payment.id })
	}
)

export { router as create_charge }
