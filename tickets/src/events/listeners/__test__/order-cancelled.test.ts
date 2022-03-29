import { OrderCancelledEvent } from '@ty-tickets/common'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket'
import { nats_wrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled'

const setup = async () => {
	const listener = new OrderCancelledListener(nats_wrapper.client)

	const order_id = new mongoose.Types.ObjectId().toHexString()

	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		user_id: '123'
	})
	ticket.set({ order_id })
	await ticket.save()

	const data: OrderCancelledEvent['data'] = {
		id: order_id,
		ticket: {
			id: ticket.id
		},
		version: 0
	}

	const msg: any = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('Updates the ticket, publishes an event, and acks the message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	const updated_ticket = await Ticket.findById(data.ticket.id)
	expect(updated_ticket!.order_id).toBeUndefined()
	expect(nats_wrapper.client.publish).toHaveBeenCalled()
	expect(msg.ack).toHaveBeenCalled()
})
