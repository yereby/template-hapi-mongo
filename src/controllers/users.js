const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

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

/**
 * Show one user infos based on its _id
 *
 * @example GET /users/{ObjectId}
 * @params {string} id ObjectId of the user
 * @return {Object} User wanted || status code 404
 */
module.exports.one = {
  validate: {
    params: {
      id: Joi.objectId()
    }
  },
  handler: request => {
    return User.findOne({_id: request.params.id})
      .then(user => user || Boom.notFound())
      .catch(err => Boom.badImplementation(err))
  }
}

/**
 * Create one user
 *
 * @example POST /users
 * @params {string} email Email of the user
 * @params {string} name Name of the user
 * @params {Array} scope Rights of the user
 * @return {Object} User created || Some errors
 */
module.exports.create = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      name: Joi.string(),
      scope: Joi.array()
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
 * Update one user informations
 *
 * @example PUT /users/{ObjectId}
 * @params {string} id ObjectId of the user
 * @return {Object} User removed || status code 404
 */
module.exports.set = {
  validate: {
    params: {
      id: Joi.objectId()
    },
    payload: {
      name: Joi.string(),
      scope: Joi.array()
    }
  },
  handler: request => {
    return User.findOneAndUpdate({ _id: request.params.id }, request.payload, { new: true})
      .then(user => user || Boom.notFound())
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
 * Remove one user based on its _id
 *
 * @example DELETE /users/{ObjectId}
 * @params {string} id ObjectId of the user
 * @return {Object} User removed || status code 404
 */
module.exports.remove = {
  validate: {
    params: {
      id: Joi.objectId()
    }
  },
  handler: request => {
    return User.findOneAndRemove({ _id: request.params.id })
      .then(user => user || Boom.notFound())
      .catch(err => Boom.badImplementation(err))
  }
}
