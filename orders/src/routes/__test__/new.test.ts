import { Order, OrderStatus } from '../../models/order'
import { nats_wrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'
import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'

it('returns an error if the ticket does not exist', async () => {
	const ticket_id = new mongoose.Types.ObjectId()

	await request(app).post('/api/orders').set('Cookie', sign_in()).send({ ticket_id }).expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
	const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 })
	await ticket.save()

	const order = Order.build({ user_id: 'random_id', status: OrderStatus.Created, expires_at: new Date(), ticket })
	await order.save()

	await request(app).post('/api/orders').set('Cookie', sign_in()).send({ ticket_id: ticket.id }).expect(400)
})

it('reserves a ticket', async () => {
	const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 })
	await ticket.save()

	await request(app).post('/api/orders').set('Cookie', sign_in()).send({ ticket_id: ticket.id }).expect(201)
})

it('emits an order created event', async () => {
	const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 })
	await ticket.save()

	await request(app).post('/api/orders').set('Cookie', sign_in()).send({ ticket_id: ticket.id }).expect(201)

	expect(nats_wrapper.client.publish).toHaveBeenCalled()
})
