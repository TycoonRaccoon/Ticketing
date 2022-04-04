import useRequest from '../../hooks/use-request'
import Router from 'next/router'
import { useState } from 'react'

const NewTicket = () => {
	const [title, setTitle] = useState('')
	const [price, setPrice] = useState('')
	const { doRequest, errors } = useRequest({
		url: '/api/tickets',
		method: 'post',
		body: { title, price },
		onSuccess: () => Router.push('/')
	})

	const onSubmit = event => {
		event.preventDefault()
		doRequest()
	}

	const onBlur = () => {
		const value = parseFloat(price)

		if (isNaN(value)) return

		setPrice(value.toFixed(2))
	}

	return (
		<div>
			<h1>Create a ticket</h1>
			<form onSubmit={onSubmit}>
				<div className='mb-3'>
					<label htmlFor='title' className='form-label'>
						Title
					</label>
					<input id='title' type='text' className='form-control' value={title} onChange={e => setTitle(e.target.value)} />
				</div>
				<div className='mb-3'>
					<label htmlFor='price' className='form-label'>
						Price
					</label>
					<input id='price' type='number' className='form-control' value={price} onChange={e => setPrice(e.target.value)} onBlur={onBlur} />
				</div>
				{errors}
				<button type='submit' className='btn btn-primary mb-3'>
					Submit
				</button>
			</form>
		</div>
	)
}

export default NewTicket
