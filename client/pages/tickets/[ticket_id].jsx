import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const TicketShow = ({ ticket }) => {
	const { doRequest, errors } = useRequest({
		url: '/api/orders',
		method: 'post',
		body: {
			ticket_id: ticket.id
		},
		onSuccess: order => Router.push('/orders/[order_id]', `/orders/${order.id}`)
	})

	return (
		<div>
			<h1>{ticket.title}</h1> <h4>Price: {ticket.price}</h4>
			{errors}
			<button className='btn btn-primary' onClick={() => doRequest()}>
				Purchase
			</button>
		</div>
	)
}

TicketShow.getInitialProps = async (context, client) => {
	const { ticket_id } = context.query

	const { data } = await client.get(`/api/tickets/${ticket_id}`)
	return { ticket: data }
}

export default TicketShow
