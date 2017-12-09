const Boom = require('boom')
const Joi = require('joi')
Joi.ObjectId = require('joi-objectid')(Joi)

const User = require('../models/users')


/**
 * Show the list of all users
 *
 * @example GET /users/
 * @return {Object} The list of users || status code 404
 */
module.exports.list = () => {
  return User.find({})
    .then(users => users.length ? users : Boom.notFound())
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

/**
 * Remove one user based on his _id
 *
 * @example DELETE /users/{ObjectId}
 * @params {string} id ObjectId of the user
 * @return {Object} User removed || status code 404
 */
module.exports.remove = {
  validate: {
    params: {
      id: Joi.ObjectId()
    }
  },
  handler: request => {
    return User.findOneAndRemove({ _id: request.params.id })
      .then(user =>  user || Boom.notFound())
      .catch(err => Boom.badImplementation(err))
  }
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
