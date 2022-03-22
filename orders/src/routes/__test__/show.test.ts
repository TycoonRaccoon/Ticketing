import { Ticket } from '../../models/ticket'
import { app } from '../../app'
import request from 'supertest'

it('fetches the order', async () => {
	const ticket = Ticket.build({ title: 'concert', price: 20 })
	await ticket.save()

	const user = sign_in()

	const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticket_id: ticket.id }).expect(201)
	const { body: fetch_order } = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).send().expect(200)

	expect(fetch_order.id).toEqual(order.id)
})

it('returns an error if one user tries to fetch another users order', async () => {
	const ticket = Ticket.build({ title: 'concert', price: 20 })
	await ticket.save()

	const { body: order } = await request(app).post('/api/orders').set('Cookie', sign_in()).send({ ticket_id: ticket.id }).expect(201)
	await request(app).get(`/api/orders/${order.id}`).set('Cookie', sign_in()).send().expect(401)
})
