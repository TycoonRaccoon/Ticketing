import { ExpirationCompleteEvent, OrderStatus } from '@ty-tickets/common'
import { ExpirationCompleteListener } from '../expiration-complete'
import { nats_wrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'
import mongoose from 'mongoose'

const setup = async () => {
	const listener = new ExpirationCompleteListener(nats_wrapper.client)

	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20
	})
	await ticket.save()

	const order = Order.build({
		status: OrderStatus.Created,
		user_id: new mongoose.Types.ObjectId().toHexString(),
		expires_at: new Date(),
		ticket
	})
	await order.save()

	const data: ExpirationCompleteEvent['data'] = {
		order_id: order.id
	}

	const msg: any = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('updates the order status to cancelled', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	const updated_order = await Order.findById(data.order_id)

	expect(updated_order!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an OderCancelled event', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	expect(nats_wrapper.client.publish).toHaveBeenCalled()

	const event_data = JSON.parse((nats_wrapper.client.publish as jest.Mock).mock.calls[0][1])
	expect(event_data.id).toEqual(data.order_id)
})

it('ack the message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
})
