import { Ticket } from '../../models/ticket'
import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'

const buildTicket = async () => {
	const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 })
	await ticket.save()

	return ticket
}

it('fetches orders for an particular user', async () => {
	const ticket_1 = await buildTicket()
	const ticket_2 = await buildTicket()
	const ticket_3 = await buildTicket()

	const user_1 = sign_in()
	const user_2 = sign_in()

	await request(app).post('/api/orders').set('Cookie', user_1).send({ ticket_id: ticket_1.id }).expect(201)

	const {
		body: { id: id_1 }
	} = await request(app).post('/api/orders').set('Cookie', user_2).send({ ticket_id: ticket_2.id }).expect(201)
	const {
		body: { id: id_2 }
	} = await request(app).post('/api/orders').set('Cookie', user_2).send({ ticket_id: ticket_3.id }).expect(201)

	const response = await request(app).get('/api/orders').set('Cookie', user_2).expect(200)

	expect(response.body.length).toEqual(2)

	expect(response.body[0].id).toEqual(id_1)
	expect(response.body[0].ticket.id).toEqual(ticket_2.id)

	expect(response.body[1].id).toEqual(id_2)
	expect(response.body[1].ticket.id).toEqual(ticket_3.id)
})
