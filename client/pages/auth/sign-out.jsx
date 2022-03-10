import useRequest from '../../hooks/use-request'
import Router from 'next/router'
import { useEffect } from 'react'

const SignOut = () => {
	const { doRequest } = useRequest({ url: '/api/users/sign-out', method: 'post', body: {}, onSuccess: () => Router.push('/') })

	useEffect(doRequest, [])

	return <div>Signing you out...</div>
}

export default SignOut
