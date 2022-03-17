import { Ticket } from '../models/ticket'

import express from 'express'

const router = express.Router()

router.get('/api/tickets', async (req, res) => {
	const tickets = await Ticket.find({})

	res.json(tickets)
})

export { router as index_ticket }
