import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import RequestInterface from '../interfaces/RequestInterface'

class UserController {
  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const user = await new User(req.body).save()
      return res.status(201).send(user)
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).send({ error: 'User not found' })
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).send({ error: 'Invalid password' })
    const token = jwt.sign({ id: user._id }, process.env.APP_SECRET, { expiresIn: '1d' })
    return res.send({ user, token })
  }

  public async me (req: RequestInterface, res: Response): Promise<Response> {
    const { userId } = req
    const user = await User.findById(userId)
    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email
    })
  }

  public async update (req: RequestInterface, res: Response): Promise<Response> {
    const { userId } = req
    const user = await User.findById(userId)

    const { name } = req.body
    user.name = name
    await user.save()

    return res.send(user)
  }

  public async index (req: Request, res: Response): Promise<Response> {
    const users = await User.find()

    return res.send(users)
  }

  public async delete (req: RequestInterface, res: Response): Promise<Response> {
    const { userId } = req
    const user = await User.findByIdAndDelete(userId)

    return res.send(user)
  }
}

export default new UserController()
