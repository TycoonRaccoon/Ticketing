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
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
}

const Ticket_schema = new mongoose.Schema(
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

Ticket_schema.statics.build = (attrs: TicketAttrs) => new Ticket<TicketAttrs>(attrs)

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', Ticket_schema)

export { Ticket }
