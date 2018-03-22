const Joi = require('joi')
const Boom = require('Boom')
const JWT = require('jsonwebtoken')

const Auth = require('../models/auth')

function generateToken(email, key) {
  const nowInSeconds = Math.round(new Date().getTime() / 1000)
  const exp = nowInSeconds + Number(process.env.TOKEN_EXPIRATION_SECONDS || 10)
  const obj = { email, admin: false, exp }

  const token = JWT.sign(obj, key)
  return token
}

module.exports.generateToken = generateToken

module.exports.ask = {
  auth: false,
  tags: ['api', 'tokens'],
  description: 'Ask for a token',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 1, } },
  validate: {
    payload: {
      email: Joi.string().email().trim().required().description('Email of an existing user'),
    }
  },
  handler: async function (request) {
    const email = request.payload.email

    // TODO Check dans la base users
    const token = generateToken(email, this.secretKey)
    const iat = JWT.decode(token).iat

    try {
      await Auth.create({ email, iat })
      return { token, iat }
    } catch(err) { throw err }
  }
}

module.exports.revoke = {
  tags: ['api', 'tokens'],
  description: 'Revoke a token',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 2, } },
  validate: {
    payload: {
      email: Joi.string().email().trim().required().description('Email of the user'),
      token: Joi.string().trim().required().description('The token to revoke'),
    }
  },
  handler: async (request, h) => {
    const { email, token } = request.payload
    const iat = JWT.decode(token).iat

    try {
      const remove = await Auth.remove({ email, iat })
      if (remove.n === 0) { return Boom.notFound() }

      return h.response().code(204)
    } catch(err) { throw err }
  }
}
