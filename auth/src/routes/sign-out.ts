import express from 'express'

const router = express.Router()

router.post('/api/users/sign-out', (req, res) => {
	req.session = null
	res.status(200).json({})
})

export { router as sign_out_router }
