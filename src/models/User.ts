import mongoose, { Schema } from 'mongoose'

interface User {
    name: string,
    email: string
}

const UserSchema = new Schema<User>({
  name: String,
  email: String
})

const userModel = mongoose.model('User', UserSchema)

export default userModel
