import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import { useEffect, useState } from 'react'
import Router from 'next/router'

const OrderShow = ({ order, current_user }) => {
	const [time_left, setTimeLeft] = useState(0)
	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			order_id: order.id
		},
		onSuccess: () => Router.push('/orders')
	})

	useEffect(() => {
		const findTimeLeft = () => {
			const ms_left = new Date(order.expires_at) - new Date()
			setTimeLeft(Math.round(ms_left / 1000))
		}

		findTimeLeft()
		const timer_id = setInterval(findTimeLeft, 1000)

		return () => {
			clearInterval(timer_id)
		}
	}, [order])

	if (time_left < 0) return <div>Order expired</div>

	return (
		<div>
			{time_left} seconds until order expires
			<StripeCheckout
				token={({ id }) => doRequest({ token: id })}
				stripeKey='pk_test_51KjDdWAn9IeLNNKrrHMPiqMdDktRcIsagYYFWqC0YIfR5h157tTxqjsQdjMcXn8w9Wd5SaretNkWW3XeKhoRGLyr00wcDcSQE4'
				amount={order.ticket.price * 100}
				email={current_user.email}
			/>
			{errors}
		</div>
	)
}

OrderShow.getInitialProps = async (context, client) => {
	const { order_id } = context.query
	const { data } = await client.get(`/api/orders/${order_id}`)
	return { order: data }
}

export default OrderShow
