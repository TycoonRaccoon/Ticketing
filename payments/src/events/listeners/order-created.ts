import { Listener, OrderCreatedEvent, Subjects } from '@ty-tickets/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
	readonly queue_group_name = 'payments-service'

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const order = Order.build({
			id: data.id,
			status: data.status,
			price: data.ticket.price,
			user_id: data.user_id,
			version: data.version
		})
		await order.save()

		msg.ack()
	}
}
