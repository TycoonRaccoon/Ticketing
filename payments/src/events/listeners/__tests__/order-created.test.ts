import { OrderCreatedEvent, OrderStatus } from '@ty-tickets/common'
import { OrderCreatedListener } from '../order-created'
import { nats_wrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import mongoose from 'mongoose'

const setup = async () => {
	const listener = new OrderCreatedListener(nats_wrapper.client)

	const data: OrderCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		expires_at: new Date().toString(),
		user_id: new mongoose.Types.ObjectId().toHexString(),
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString(),
			price: 20
		},
		version: 0
	}

	const msg: any = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('replicates the order info', async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg)

	const order = await Order.findById(data.id)

	expect(order!.price).toEqual(data.ticket.price)
})

it('ack the message', async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
})
