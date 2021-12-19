import { Request, Response } from 'express'
import User from '../models/User'

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = await User.find()

    return res.send(users)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const user = await new User(req.body).save()

    return res.send(user)
  }

  public async find (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const user = await User.findById(id)

    return res.send(user)
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })

    return res.send(user)
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)

    return res.send(user)
  }
}

export default new UserController()
