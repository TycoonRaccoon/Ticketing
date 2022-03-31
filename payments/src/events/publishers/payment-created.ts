import { PaymentCreatedEvent, Publisher, Subjects } from '@ty-tickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated
}
