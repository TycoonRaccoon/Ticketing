import { OrderStatus } from '@ty-tickets/common'
import { Order } from '../../models/order'
import { stripe } from '../../stripe'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Payment } from '../../models/payment'

it('returns a 404 when purchasing an order that does not exist', async () => {
	await request(app)
		.post('/api/payments')
		.set('Cookie', sign_in())
		.send({
			token: 'fake token',
			order_id: new mongoose.Types.ObjectId().toHexString()
		})
		.expect(404)
})

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 20,
		status: OrderStatus.Created,
		user_id: new mongoose.Types.ObjectId().toHexString(),
		version: 0
	})
	await order.save()

	await request(app)
		.post('/api/payments')
		.set('Cookie', sign_in())
		.send({
			token: 'fake token',
			order_id: order.id
		})
		.expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
	const user_id = new mongoose.Types.ObjectId().toHexString()

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 20,
		status: OrderStatus.Cancelled,
		user_id,
		version: 0
	})
	await order.save()

	await request(app)
		.post('/api/payments')
		.set('Cookie', sign_in(user_id))
		.send({
			token: 'fake token',
			order_id: order.id
		})
		.expect(400)
})

it('returns a 201 with valid inputs', async () => {
	const user_id = new mongoose.Types.ObjectId().toHexString()
	const price = Math.floor(Math.random() * 100000)

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price,
		status: OrderStatus.Created,
		user_id,
		version: 0
	})
	await order.save()

	await request(app)
		.post('/api/payments')
		.set('Cookie', sign_in(user_id))
		.send({
			token: 'tok_visa',
			order_id: order.id
		})
		.expect(201)

	const stripe_charges = await stripe.charges.list({ limit: 50 })
	const stripe_charge = stripe_charges.data.find(charge => charge.amount === price * 100)

	expect(stripe_charge).toBeDefined()
	expect(stripe_charge!.currency).toEqual('usd')

	const payment = await Payment.findOne({
		order_id: order.id,
		stripe_id: stripe_charge!.id
	})

	expect(payment).not.toBeNull()
})
