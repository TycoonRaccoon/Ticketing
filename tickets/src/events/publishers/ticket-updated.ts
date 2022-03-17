import { Publisher, Subjects, TicketUpdatedEvent } from '@ty-tickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated
}
