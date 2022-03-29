import { Listener, Subjects, TicketCreatedEvent } from '@ty-tickets/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated
	readonly queue_group_name = 'order-service'

	async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
		const { id, title, price } = data

		const ticket = Ticket.build({ id, title, price })
		await ticket.save()

		msg.ack()
	}
}
