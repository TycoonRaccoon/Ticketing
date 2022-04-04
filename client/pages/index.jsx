import Link from 'next/link'

const LandingPage = ({ current_user, tickets }) => {
	const ticket_list = tickets.map(ticket => (
		<tr key={ticket.id}>
			<td>{ticket.title}</td>
			<td>{ticket.price}</td>
			<td>
				<Link href='/tickets/[ticket_id]' as={`/tickets/${ticket.id}`}>
					<a>View</a>
				</Link>
			</td>
		</tr>
	))

	return (
		<div>
			<h1>Tickets</h1>
			<table className='table'>
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>{ticket_list}</tbody>
			</table>
		</div>
	)
}

LandingPage.getInitialProps = async (context, client, current_user) => {
	const { data } = await client.get('/api/tickets')

	return { tickets: data }
}

export default LandingPage
