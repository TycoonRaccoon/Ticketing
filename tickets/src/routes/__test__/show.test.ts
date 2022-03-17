import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

it('returns 404 if the ticket is not found', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()
	await request(app).get(`/api/tickets/${id}`).send().expect(404)
})

it('returns the ticket if tha ticket is found', async () => {
	const title = 'title'
	const price = 20

	const response = await request(app).post('/api/tickets').set('Cookie', sign_in()).send({ title, price }).expect(201)
	const ticket_response = await request(app).get(`/api/tickets/${response.body.id}`).expect(200)

	expect(ticket_response.body.title).toEqual(title)
	expect(ticket_response.body.price).toEqual(price)
})
