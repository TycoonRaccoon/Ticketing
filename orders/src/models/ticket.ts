import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Order, OrderStatus } from './order'
import mongoose from 'mongoose'

interface TicketAttrs {
	id: string
	title: string
	price: number
}

export interface TicketDoc extends mongoose.Document {
	title: string
	price: number
	version: number
	isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
	findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
}

const ticket_schema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true,
			min: 0
		}
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
			}
		}
	}
)

ticket_schema.set('versionKey', 'version')
ticket_schema.plugin(updateIfCurrentPlugin)

ticket_schema.statics.build = (attrs: TicketAttrs) => new Ticket({ _id: attrs.id, title: attrs.title, price: attrs.price })
ticket_schema.statics.findByEvent = async (event: { id: string; version: number }) => Ticket.findOne({ _id: event.id, version: event.version - 1 })

ticket_schema.methods.isReserved = async function () {
	const existing_order = await Order.findOne({
		ticket: this,
		status: {
			$ne: OrderStatus.Cancelled
		}
	})

	return !!existing_order
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticket_schema)

export { Ticket }
