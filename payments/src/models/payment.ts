import mongoose from 'mongoose'

interface PaymentAttrs {
	order_id: string
	stripe_id: string
}

interface PaymentDoc extends mongoose.Document {
	order_id: string
	stripe_id: string
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
	build(attrs: PaymentAttrs): PaymentDoc
}

const payment_schema = new mongoose.Schema<PaymentDoc, PaymentModel>(
	{
		order_id: {
			type: String,
			required: true
		},
		stripe_id: {
			type: String,
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

payment_schema.statics.build = (attrs: PaymentAttrs) => new Payment(attrs)

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', payment_schema)

export { Payment }
