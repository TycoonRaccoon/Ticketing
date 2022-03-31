import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from '@ty-tickets/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated
	readonly queue_group_name = 'orders-service'

	async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
		const order = await Order.findById(data.order_id)
		if (!order) throw new Error('Order not found')

		order.set({ status: OrderStatus.Complete })
		await order.save()

		msg.ack()
	}
}
