import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
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

describe('User tests', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: user.name, email: user.email, password: user.password })
    const { body } = response

    expect(response.status).toBe(201)
    expect(body).toHaveProperty('_id')
    expect(body.name).toBe(user.name)
    expect(body.email).toBe(user.email)
    const comparePassword = bcrypt.compareSync(user.password, body.password)
    expect(comparePassword).toBe(true)
  })

  it('should not create a new user with invalid data', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: '',
        email: '',
        password: ''
      })
    const { body } = response

    expect(response.status).toBe(400)
    expect(body).toHaveProperty('error')
  })

  it('should be possible update a user', async () => {
    const responseToken = await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        password: user.password
      })
    const { body: bodyToken } = responseToken
    const { token } = bodyToken

    user.name = faker.name.findName()
    const response = await request(app)
      .put('/me')
      .send({
        name: user.name
      })
      .set('Authorization', `Bearer ${token}`)
    const { body } = response

    expect(response.status).toBe(200)
    expect(body).toHaveProperty('_id')
    expect(body.name).toBe(user.name)
  })

  it('should be possible delete a user', async () => {
    const responseToken = await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        password: user.password
      })
    const { body: bodyToken } = responseToken
    const { token } = bodyToken

    user.name = faker.name.findName()
    const response = await request(app)
      .delete('/me')
      .set('Authorization', `Bearer ${token}`)
    const { body } = response

    expect(response.status).toBe(200)
    expect(body).toHaveProperty('_id')
    await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        password: user.password
      })
      .expect(401)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
