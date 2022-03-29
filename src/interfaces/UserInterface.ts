import mongoose from 'mongoose'

interface UserInterface extends mongoose.Document {
    name: string,
    email: string,
    password: string,
}

export default UserInterface
