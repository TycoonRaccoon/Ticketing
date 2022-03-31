import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@ty-tickets/common'
import { OrderCancelledPublisher } from '../publishers/cancelled'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete
	readonly queue_group_name = 'orders-service'

	async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
		const order = await Order.findById(data.order_id).populate('ticket')

		if (!order) throw new Error('Order not found')
		if (order.status === OrderStatus.Complete) return msg.ack()

		order.set({ status: OrderStatus.Cancelled })
		await order.save()

		await new OrderCancelledPublisher(this.client).publish({ id: order.id, version: order.version, ticket: { id: order.ticket.id } })

		msg.ack()
	}
}
