import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../app'

declare global {
	var sign_in: () => Promise<string[]>
}

let mongo: MongoMemoryServer

beforeAll(async () => {
	process.env.JWT_KEY = 'secret'

	mongo = await MongoMemoryServer.create()
	const mongo_uri = mongo.getUri()

	await mongoose.connect(mongo_uri)
})

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections()

	for (const collection of collections) {
		await collection.deleteMany({})
	}
})

afterAll(async () => {
	await mongo.stop()
	await mongoose.connection.close()
})

global.sign_in = async () => {
	const email = 'test@test.com'
	const password = 'password'

	const response = await request(app).post('/api/users/sign-up').send({ email, password }).expect(201)

	const cookie = response.get('Set-Cookie')

	return cookie
}
