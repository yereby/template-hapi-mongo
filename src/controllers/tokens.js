const Joi = require('joi')
const Boom = require('Boom')
const JWT = require('jsonwebtoken')

const User = require('../models/user')
const Auth = require('../models/auth')

/**
 * Generate a token
 *
 * We pass the payload with an expiration key
 * The expiration time is based on the current time + TOKEN_EXPIRATION_SECONDS
 * The fallback value for TOKEN_EXPIRATION_SECONDS is ten seconds
 */
function generateToken(payload, key) {
  const nowInSeconds = Math.round(new Date().getTime() / 1000)
  const exp = nowInSeconds + Number(process.env.TOKEN_EXPIRATION_SECONDS || 10)

  const obj = { ...payload, exp }

  const token = JWT.sign(obj, key)
  return token
}

module.exports.generateToken = generateToken

/**
 * Return a new token
 *
 * Based on an email that must be in the users collection
 * Otherwise we throw a 404
 *
 * The email, name and scope of the user are put in the payload
 * Then we create an entry in the auth collection
 *
 * @example POST /tokens
 */
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
    const uri = request.server.info.uri

    try {
      const user = await User.findOne({ email })
      if (!user) { return Boom.notFound() }

      const payload = {
        email: user.email,
        name: user.name,
        scope: user.scope,
      }

      const token = generateToken(payload, this.secretKey)
      const connectionURL = uri + '/tokens/' + token

      await Auth.create({ email, token })

      return { token, connectionURL }
    } catch(err) { return Boom.badImplementation(err) }
  }
}

/**
 * Revoke a token
 *
 * If the token is not in the auth collection we throw a 404
 * Else we remove the document
 *
 * @example DELETE /tokens
 */
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
    try {
      const remove = await Auth.remove(request.payload)
      if (remove.n === 0) { return Boom.notFound() }

      return h.response().code(204)
    } catch(err) { return Boom.badImplementation(err) }
  }
}

/**
 * Check if a token is valid
 *
 * TODO Send it to the session
 * TODO Check if expired
 */
module.exports.connection = {
  auth: false,
  tags: ['api', 'tokens'],
  description: 'Verify a token',
  validate: {
    params: {
      token: Joi.string().description('Token to verify')
    }
  },
  handler: async function (request) {
    try {
      const token = request.params.token

      const auth = Auth.findOne({ token })
      if (!auth) { return Boom.unauthorized() }

      return { isValid: true }
    } catch(err) { return Boom.badImplementation(err) }
  }
}
