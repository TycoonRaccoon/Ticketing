import { Publisher, OrderCancelledEvent, Subjects } from '@ty-tickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled
}
