import { TicketUpdatedListener } from '../ticket-updated'
import { TicketUpdatedEvent } from '@ty-tickets/common'
import { nats_wrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'

const setup = async () => {
	const listener = new TicketUpdatedListener(nats_wrapper.client)

	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 10
	})

	await ticket.save()

	const data: TicketUpdatedEvent['data'] = {
		id: ticket.id,
		title: 'new concert',
		price: 100,
		user_id: new mongoose.Types.ObjectId().toHexString(),
		version: ticket.version + 1
	}

	const msg: any = {
		ack: jest.fn()
	}

	return { listener, data, msg }
}

it('finds, updates and saves a ticket', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	const updated_ticket = await Ticket.findById(data.id)

	expect(updated_ticket!.title).toEqual(data.title)
	expect(updated_ticket!.price).toEqual(data.price)
	expect(updated_ticket!.version).toEqual(data.version)
})

it('acks the message', async () => {
	const { listener, data, msg } = await setup()

	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
	const { listener, data, msg } = await setup()

	try {
		data.version++
		await listener.onMessage(data, msg)
	} catch (error) {}

	expect(msg.ack).not.toHaveBeenCalled()
})
