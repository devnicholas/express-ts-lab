import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import UserInterface from '../interfaces/UserInterface'

const UserSchema = new Schema<UserInterface>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

UserSchema.pre('save', function (next) {
  const user = this as UserInterface
  if (!user.isModified('password')) {
    return next()
  }
  user.password = bcrypt.hashSync(user.password, 10)
  next()
})

const userModel = mongoose.model('User', UserSchema)

export default userModel
