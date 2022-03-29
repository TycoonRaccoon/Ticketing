import { nats_wrapper } from '../../nats-wrapper'
import { OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'

it('marks an order as cancelled', async () => {
	const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 })
	await ticket.save()

	const user = sign_in()

	const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticket_id: ticket.id }).expect(201)

	await request(app).patch(`/api/orders/${order.id}/cancel`).set('Cookie', user).send().expect(200)

	const { body: updated_order } = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).send().expect(200)

	expect(updated_order.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
	const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 })
	await ticket.save()

	const user = sign_in()

	const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticket_id: ticket.id }).expect(201)
	await request(app).patch(`/api/orders/${order.id}/cancel`).set('Cookie', user).send().expect(200)

	expect(nats_wrapper.client.publish).toHaveBeenCalled()
})
