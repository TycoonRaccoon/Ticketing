import { nats_wrapper } from '../../nats-wrapper'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('return a 404 if the provided id does not exists', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()
	await request(app).put(`/api/tickets/${id}`).set('Cookie', sign_in()).send({ title: 'title', price: 20 }).expect(404)
})

it('return a 401 if the user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()
	await request(app).put(`/api/tickets/${id}`).send({ title: 'title', price: 20 }).expect(401)
})

it('return a 401 if the user does not own the ticket', async () => {
	const response = await request(app).post('/api/tickets').set('Cookie', sign_in()).send({ title: 'title', price: 20 })

	await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', sign_in()).send({ title: 'updated title', price: 1000 }).expect(401)
})

it('return a 400 if the user provide an invalid title or price', async () => {
	const cookie = sign_in()

	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'title', price: 20 })

	await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: '', price: 20 }).expect(400)
	await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: 'title', price: -20 }).expect(400)
})

it('updates the ticket provided valid inputs', async () => {
	const cookie = sign_in()

	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'title', price: 20 })
	await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: 'New title', price: 100 }).expect(200)

	const ticket_response = await request(app).get(`/api/tickets/${response.body.id}`).send()

	expect(ticket_response.body.title).toEqual('New title')
	expect(ticket_response.body.price).toEqual(100)
})

it('publishes an event', async () => {
	const cookie = sign_in()

	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'title', price: 20 })
	await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: 'New title', price: 100 }).expect(200)

	expect(nats_wrapper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async () => {
	const cookie = sign_in()

	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'title', price: 20 })

	const ticket = await Ticket.findById(response.body.id)
	ticket!.set({ order_id: new mongoose.Types.ObjectId().toHexString() })
	await ticket!.save()

	await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: 'New title', price: 100 }).expect(400)
})
