import { OrderCancelledListener } from './events/listeners/order-cancelled'
import { OrderCreatedListener } from './events/listeners/order-created'
import { nats_wrapper } from './nats-wrapper'
import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
	if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined')

	if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined')

	if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined')
	if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined')
	if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined')

	try {
		await mongoose.connect(process.env.MONGO_URI)
		console.log('Connected to MongoDB')

		await nats_wrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

		new OrderCreatedListener(nats_wrapper.client).listen()
		new OrderCancelledListener(nats_wrapper.client).listen()

		nats_wrapper.client.on('close', () => {
			console.log('NATS connection closed!')
			process.exit()
		})

		process.on('SIGINT', () => nats_wrapper.client.close())
		process.on('SIGTERM', () => nats_wrapper.client.close())

		app.listen(3000, () => {
			console.log('Listening on port: 3000')
		})
	} catch (error) {
		console.error(error)
	}
}

start()
