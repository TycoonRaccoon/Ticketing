import { Listener, Subjects, TicketUpdatedEvent } from '@ty-tickets/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated
	readonly queue_group_name = 'orders-service'

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		const { title, price } = data

		const ticket = await Ticket.findByEvent(data)
		if (!ticket) throw new Error('Ticket not found')

		ticket.set({ title, price })
		await ticket.save()

		msg.ack()
	}
}
