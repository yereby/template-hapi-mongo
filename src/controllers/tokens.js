const Joi = require('joi')

const JWT = require('jsonwebtoken')

function generateToken(email, key) {
  const nowInSeconds = Math.round(new Date().getTime() / 1000)
  const exp = nowInSeconds + Number(process.env.TOKEN_EXPIRATION_SECONDS)
  const obj = { email, admin: false, exp }

  const token = JWT.sign(obj, key)
  return token
}

module.exports.ask = {
  auth: false,
  validate: {
    payload: {
      email: Joi.string().email().required(),
    }
  },
  handler: function (request) {
    const email = request.payload.email

    const token = generateToken(email, this.secretKey)
    return { token }
  }
}
