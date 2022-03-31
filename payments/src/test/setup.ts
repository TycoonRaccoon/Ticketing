import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
	var sign_in: (user_id?: string) => string[]
}

jest.mock('../nats-wrapper')
jest.setTimeout(100000)

let mongo: MongoMemoryServer
process.env.STRIPE_KEY = 'sk_test_51KjDdWAn9IeLNNKrH3IY1Jf7HTQ4zteDx8mY0hwUk3WuVCTK9QfgBCmXIRs3AkDljhgGbS2OoKCgdvmncBbRnsNk00cSZqn9WC'

beforeAll(async () => {
	process.env.JWT_KEY = 'secret'

	mongo = await MongoMemoryServer.create()
	const mongo_uri = mongo.getUri()

	await mongoose.connect(mongo_uri)
})

beforeEach(async () => {
	jest.clearAllMocks()

	const collections = await mongoose.connection.db.collections()

	for (const collection of collections) await collection.deleteMany({})
})

afterAll(async () => {
	await mongoose.disconnect()
	await mongo.stop()
})

global.sign_in = (user_id?: string) => {
	const payload = {
		id: user_id || new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com'
	}

	const token = jwt.sign(payload, process.env.JWT_KEY!)

	const session_JSON = JSON.stringify({ jwt: token })

	const base64 = Buffer.from(session_JSON).toString('base64')

	return [`session=${base64}`]
}
