import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete'
import { nats_wrapper } from '../nats-wrapper'
import Queue from 'bull'

interface Payload {
	order_id: string
}

const expiration_queue = new Queue<Payload>('order:expiration', {
	redis: {
		host: process.env.REDIS_HOST
	}
})

expiration_queue.process(async job => {
	new ExpirationCompletePublisher(nats_wrapper.client).publish({ order_id: job.data.order_id })
})

export { expiration_queue }
