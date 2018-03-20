const Joi = require('joi')
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
  tags: ['api'],
  auth: false,
  validate: {
    payload: {
      email: Joi.string().email().required(),
    }
  },
  handler: async function (request) {
    const email = request.payload.email

    const token = generateToken(email, this.secretKey)
    const iat = JWT.decode(token).iat

    try {
      await Auth.create({ email, iat })
      return { token, iat }
    } catch(err) { throw err }
  }
}

module.exports.revoke = {
  tags: ['api'],
  auth: false,
  validate: {
    payload: {
      email: Joi.string().email().required(),
      token: Joi.string().required(),
    }
  },
  handler: async function (request) {
    const { email, token } = request.payload
    const iat = JWT.decode(token).iat

    try {
      return await Auth.remove({ email, iat })
    } catch(err) { throw err }
  }
}
