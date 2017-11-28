const Boom = require('boom')
const Joi = require('joi')
const User = require('../models/users')

module.exports.list = () => {
  return User.find({})
    .then(users => {
      if (!users.length) { return Boom.notFound() }

      return users
    })
    .catch(err => Boom.badImplementation(err))
}

module.exports.create = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      name: Joi.string().required()
    }
  },
  handler: request => {
    return User.create(request.payload)
      .then()
      .catch(err => {
        switch (err.code) {
        case 11000:
        case 11001:
          return Boom.conflict(err)
        default:
          return Boom.forbidden(err)
        }
      })
  }
}

module.exports.remove = request => {
  return User.findOneAndRemove({ _id: request.params.id })
    .then(res => {
      if (!res) { return Boom.notFound() }

      return res
    })
    .catch(err => Boom.badImplementation(err))
}

module.exports.set = {
  validate: {
    payload: {
      name: Joi.string().required()
    }
  },
  handler: request => {
    return User.findOneAndUpdate({ _id: request.params.id }, request.payload, { new: true})
      .then(res => {
        if (!res) { return Boom.notFound() }

        return res
      })
      .catch(err => {
        switch (err.code) {
        case 11000:
        case 11001:
          return Boom.conflict(err)
        default:
          return Boom.forbidden(err)
        }
      })
  }
}
