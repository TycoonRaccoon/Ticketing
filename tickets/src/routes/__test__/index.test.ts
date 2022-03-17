import request from 'supertest'
import { app } from '../../app'

const create_ticket = () => {
	return request(app).post('/api/tickets').set('Cookie', sign_in()).send({ title: 'title', price: 20 })
}

it('can fetch a list of tickets', async () => {
	await create_ticket()
	await create_ticket()
	await create_ticket()

	const response = await request(app).get('/api/tickets').send().expect(200)

	expect(response.body.length).toEqual(3)
})
