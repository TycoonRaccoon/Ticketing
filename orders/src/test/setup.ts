import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
	var sign_in: () => string[]
}

jest.mock('../nats-wrapper')

let mongo: MongoMemoryServer

beforeAll(async () => {
	process.env.JWT_KEY = 'secret'

	mongo = await MongoMemoryServer.create()
	const mongo_uri = mongo.getUri()

	await mongoose.connect(mongo_uri)
})

beforeEach(async () => {
	jest.clearAllMocks()

	const collections = await mongoose.connection.db.collections()

	for (const collection of collections) {
		await collection.deleteMany({})
	}
})

afterAll(async () => {
	await mongo.stop()
	await mongoose.connection.close()
})

global.sign_in = () => {
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com'
	}

	const token = jwt.sign(payload, process.env.JWT_KEY!)

	const session_JSON = JSON.stringify({ jwt: token })

	const base64 = Buffer.from(session_JSON).toString('base64')

	return [`session=${base64}`]
}
