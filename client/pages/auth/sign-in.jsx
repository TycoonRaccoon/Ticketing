import useRequest from '../../hooks/use-request'
import Router from 'next/router'
import { useState } from 'react'

const SingIn = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { doRequest, errors } = useRequest({
		url: '/api/users/sign-in',
		method: 'post',
		body: { email, password },
		onSuccess: () => Router.push('/')
	})

	const onSubmit = async event => {
		event.preventDefault()

		await doRequest()
	}

	return (
		<form onSubmit={onSubmit}>
			<h1>Sign In</h1>
			<div className='mb-3'>
				<label htmlFor='email' className='form-label'>
					Email Address
				</label>
				<input id='email' type='email' className='form-control' required value={email} onChange={e => setEmail(e.target.value)} />
			</div>
			<div className='mb-3'>
				<label htmlFor='password' className='form-label'>
					Password
				</label>
				<input id='password' type='password' className='form-control' required value={password} onChange={e => setPassword(e.target.value)} />
			</div>
			{errors}
			<button type='submit' className='btn btn-primary mb-3'>
				Sign In
			</button>
		</form>
	)
}

export default SingIn
