import { Listener, OrderCreatedEvent, Subjects } from '@ty-tickets/common'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
	readonly queue_group_name = 'tickets-service'

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id)
		if (!ticket) throw new Error('Ticket not found')

		ticket.set({ order_id: data.id })
		await ticket.save()

		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			user_id: ticket.user_id,
			order_id: ticket.order_id,
			version: ticket.version
		})

		msg.ack()
	}
}
