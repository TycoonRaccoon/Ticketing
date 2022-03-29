import { TicketCreatedListener } from '../ticket-created'
import { TicketCreatedEvent } from '@ty-tickets/common'
import { nats_wrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'

const setup = async () => {
	const listener = new TicketCreatedListener(nats_wrapper.client)

	const data: TicketCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 10,
		user_id: new mongoose.Types.ObjectId().toHexString(),
		version: 0
	}

	const msg: any = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	const ticket = await Ticket.findById(data.id)

	expect(ticket!.title).toEqual(data.title)
	expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
})
