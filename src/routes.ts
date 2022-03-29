import { Router } from 'express'
import UserController from './controllers/UserController'
import AuthMiddleware from './middlewares/AuthMiddleware'

const routes = Router()

routes.post('/users', UserController.store)
routes.post('/users/login', UserController.login)

routes.use(AuthMiddleware)

routes.get('/me', UserController.me)
routes.put('/me', UserController.update)
routes.delete('/me', UserController.delete)
routes.get('/users', UserController.index)

export default routes
