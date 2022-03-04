import request from 'supertest'
import { app } from '../../app'

it('responds with details about the current user', async () => {
	const cookie = await global.sign_in()

	const response = await request(app).get('/api/users/current-user').set('Cookie', cookie).expect(200)
	expect(response.body.current_user.email).toEqual('test@test.com')
})

it('responds with null if not authenticated', async () => {
	const response = await request(app).get('/api/users/current-user').expect(200)

	expect(response.body.current_user).toEqual(null)
})
