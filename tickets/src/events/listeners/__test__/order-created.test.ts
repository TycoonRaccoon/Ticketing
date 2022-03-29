import { OrderCreatedListener } from '../order-created'
import { nats_wrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { OrderCreatedEvent, OrderStatus } from '@ty-tickets/common'
import mongoose from 'mongoose'

const setup = async () => {
	const listener = new OrderCreatedListener(nats_wrapper.client)

	const ticket = Ticket.build({ title: 'concert', price: 10, user_id: '123' })
	await ticket.save()

	const data: OrderCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		user_id: '234',
		expires_at: '444',
		version: 0,
		ticket: {
			id: ticket.id,
			price: ticket.price
		}
	}

	const msg: any = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('sets the user_id of the ticket', async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg)

	const updated_ticket = await Ticket.findById(data.ticket.id)

	expect(updated_ticket!.order_id).toEqual(data.id)
})

it('acks the message', async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg)

	expect(nats_wrapper.client.publish).toHaveBeenCalled()
})
