import mongoose from 'mongoose'
import { Password } from '../services/password'

interface UserAttrs {
	email: string
	password: string
}

interface UserDoc extends mongoose.Document {
	email: string
	password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc
}

const user_schema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.password
				delete ret.__v
			}
		}
	}
)

user_schema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.to_hash(this.get('password'))
		this.set('password', hashed)
	}
	done()
})
user_schema.statics.build = (attrs: UserAttrs) => new User<UserAttrs>(attrs)

const User = mongoose.model<UserDoc, UserModel>('User', user_schema)

export { User }
