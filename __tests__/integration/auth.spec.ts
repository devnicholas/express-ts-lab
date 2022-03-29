import mongoose from 'mongoose'
import faker from '@faker-js/faker'
import dotenv from 'dotenv'
import request from 'supertest'
import app from '../../src/server'
dotenv.config()

const user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}

describe('Authentication tests', () => {
  it('should be possible make login with valid user', async () => {
    await request(app)
      .post('/users')
      .send({ ...user })

    const response = await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        password: user.password
      })
    const { body } = response

    expect(response.status).toBe(200)
    expect(body).toHaveProperty('token')
  })

  it('should not be possible make login with invalid email and password', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password()
      })
    const { body } = response

    expect(response.status).toBe(401)
    expect(body).toHaveProperty('error')
  })

  it('should not be possible make login with invalid password', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        password: faker.internet.password()
      })
    const { body } = response

    expect(response.status).toBe(401)
    expect(body).toHaveProperty('error')
  })

  it('should be possible get user data', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        password: user.password
      })
    const { body } = response
    const { token } = body

    const responseMe = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
    const { body: bodyMe } = responseMe

    expect(responseMe.status).toBe(200)
    expect(bodyMe).toHaveProperty('_id')
    expect(bodyMe.name).toBe(user.name)
    expect(bodyMe.email).toBe(user.email)
  })

  it('should not be possible get user data without valid token', async () => {
    const response = await request(app)
      .get('/me')
      .set('Authorization', 'Bearer 123123123')
    const { body } = response

    expect(response.status).toBe(403)
    expect(body).toHaveProperty('error')
  })

  it('should be possible get private routes with valid token', async () => {
    const responseToken = await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        password: user.password
      })
    const { body: bodyToken } = responseToken
    const { token } = bodyToken

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it('should not be possible get private routes without valid token', async () => {
    const response = await request(app)
      .get('/users')
    const { body } = response

    expect(response.status).toBe(403)
    expect(body).toHaveProperty('error')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
