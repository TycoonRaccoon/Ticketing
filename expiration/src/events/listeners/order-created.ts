import { Listener, OrderCreatedEvent, Subjects } from '@ty-tickets/common'
import { Message } from 'node-nats-streaming'
import { expiration_queue } from '../../queues/expiration'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
	readonly queue_group_name = 'expiration-service'

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const delay = new Date(data.expires_at).getTime() - new Date().getTime()

		await expiration_queue.add({ order_id: data.id }, { delay })

		msg.ack()
	}
}
