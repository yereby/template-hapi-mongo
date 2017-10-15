const Boom = require('boom')
const Joi = require('joi')
const User = require('../models/users')

module.exports.list = (request, reply) => {
  User.find({})
    .then(users => {
      if (!users.length) { return reply(Boom.notFound()) }

      return reply(users)
    })
    .catch(err => reply(Boom.badImplementation(err)))
}

module.exports.signup = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      name: Joi.string().required()
    }
  },
  handler: (request, reply) => {
    const newUser = new User(request.payload)

    newUser.create()
      .then(reply)
      .catch(err => {
        switch (err.code) {
        case 11000:
        case 11001:
          reply(Boom.conflict(err))
          break
        default:
          reply(Boom.forbidden(err))
        }
      })
  }
}

module.exports.remove = (request, reply) => {
  User.remove({ _id: request.params.id })
    .then(response => {
      if (response.result && response.result.n === 0) {
        return reply(Boom.notFound())
      }

      return reply()
    })
    .catch(err => reply(Boom.badImplementation(err)))
}
