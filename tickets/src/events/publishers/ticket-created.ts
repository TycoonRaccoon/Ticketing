import { Publisher, Subjects, TicketCreatedEvent } from '@ty-tickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated
}
