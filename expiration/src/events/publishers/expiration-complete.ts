import { ExpirationCompleteEvent, Publisher, Subjects } from '@ty-tickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete
}
