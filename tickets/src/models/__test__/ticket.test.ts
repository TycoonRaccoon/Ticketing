import { Ticket } from '../ticket'

it('implements optimistic concurrency control', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 5,
		user_id: '123'
	})

	await ticket.save()

	const first_instance = await Ticket.findById(ticket.id)
	const second_instance = await Ticket.findById(ticket.id)

	first_instance!.set({ price: 10 })
	second_instance!.set({ price: 15 })

	await first_instance!.save()

	try {
		await second_instance!.save()
	} catch (error) {
		return
	}

	throw new Error('Should not reach this point')
})

it('Increments the version number on multiple saves', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 5,
		user_id: '123'
	})

	await ticket.save()
	expect(ticket.version).toEqual(0)

	await ticket.save()
	expect(ticket.version).toEqual(1)

	await ticket.save()
	expect(ticket.version).toEqual(2)
})
