import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import mongoose from 'mongoose'

interface TicketAttrs {
	title: string
	price: number
	user_id: string
}

interface TicketDoc extends mongoose.Document {
	title: string
	price: number
	user_id: string
	order_id?: string
	version: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
}

const ticket_schema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		user_id: {
			type: String,
			required: true
		},
		order_id: {
			type: String
		}
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.__v
			}
		}
	}
)

ticket_schema.set('versionKey', 'version')
ticket_schema.plugin(updateIfCurrentPlugin)

ticket_schema.statics.build = (attrs: TicketAttrs) => new Ticket<TicketAttrs>(attrs)

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticket_schema)

export { Ticket }
