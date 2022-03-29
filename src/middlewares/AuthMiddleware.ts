import jwt from 'jsonwebtoken'
import { Response } from 'express'
import RequestInterface from '../interfaces/RequestInterface'

const AuthMiddleware = (req: RequestInterface, res: Response, next) => {
  try {
    const { authorization } = req.headers
    const token = authorization.replace('Bearer ', '')
    const { id } = jwt.verify(token, process.env.APP_SECRET) as { id: string }

    req.userId = id
    return next()
  } catch (error) {
    return res.status(403).send({ error: 'Token invalid' })
  }
}

export default AuthMiddleware
