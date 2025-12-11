import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export type UserRole = 'admin' | 'seller' | 'customer'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  avatarUrl?: string
  preferences?: Record<string, unknown>
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'seller', 'customer'], default: 'customer', index: true },
  avatarUrl: { type: String },
  preferences: { type: Schema.Types.Mixed },
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
  const user = this as IUser & { isModified: (k: string) => boolean }
  if (!user.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
