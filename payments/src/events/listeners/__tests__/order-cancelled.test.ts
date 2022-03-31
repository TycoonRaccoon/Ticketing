import { OrderCancelledEvent, OrderStatus } from '@ty-tickets/common'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'
import { nats_wrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled'

const setup = async () => {
	const listener = new OrderCancelledListener(nats_wrapper.client)

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		price: 20,
		user_id: new mongoose.Types.ObjectId().toHexString(),
		version: 0
	})
	await order.save()

	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString()
		},
		version: order.version + 1
	}

	const msg: any = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('updates the status of the order', async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg)

	const updated_order = await Order.findById(data.id)

	expect(updated_order!.status).toEqual(OrderStatus.Cancelled)
})

it('ack the message', async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
})
