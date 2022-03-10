import { current_user } from '@ty-tickets/common'

import express from 'express'

const router = express.Router()

router.get('/api/users/current-user', current_user, (req, res) => {
	res.status(200).json({ current_user: req.current_user || null })
})

export { router as current_user_router }
