import { OrderStatus } from '@ty-tickets/common'
import { TicketDoc } from './ticket'
import mongoose from 'mongoose'

export { OrderStatus }

interface OrderAttrs {
	user_id: string
	status: OrderStatus
	expires_at: Date
	ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
	user_id: string
	status: OrderStatus
	expires_at: Date
	ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc
}

const order_schema = new mongoose.Schema(
	{
		user_id: {
			type: String,
			required: true
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.Created
		},
		expires_at: {
			type: mongoose.Schema.Types.Date
		},
		ticket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Ticket'
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

order_schema.statics.build = (attrs: OrderAttrs) => new Order(attrs)

const Order = mongoose.model<OrderDoc, OrderModel>('Order', order_schema)

export { Order }
