import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@ty-tickets/common'
import mongoose from 'mongoose'

interface OrderAttrs {
	id: string
	status: OrderStatus
	price: number
	user_id: string
	version: number
}

interface OrderDoc extends mongoose.Document {
	status: OrderStatus
	price: number
	user_id: string
	version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc
}

const order_schema = new mongoose.Schema(
	{
		status: {
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
		version: {
			type: Number,
			required: true
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

order_schema.set('versionKey', 'version')
order_schema.plugin(updateIfCurrentPlugin)

order_schema.statics.build = (attrs: OrderAttrs) =>
	new Order({
		_id: attrs.id,
		status: attrs.status,
		price: attrs.price,
		user_id: attrs.user_id,
		version: attrs.version
	})

const Order = mongoose.model<OrderDoc, OrderModel>('Order', order_schema)

export { Order }
