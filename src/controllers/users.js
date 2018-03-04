const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const User = require('../models/user')

/**
 * Show the list of all users
 *
 * @example GET /users/
 * @return {Object} The list of users || status code 404
 */
module.exports.list =  {
  tags: ['api'],
  handler: () => {
    return User.find({})
      .then(users => users.length ? users : Boom.notFound())
      .catch(err => Boom.badImplementation(err))
  }
}

/**
 * Show one user infos based on its _id
 *
 * @example GET /users/{ObjectId}
 * @params {string} id ObjectId of the user
 * @return {Object} User wanted || status code 404
 */
module.exports.one = {
  tags: ['api'],
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
  tags: ['api'],
  validate: {
    payload: {
      email: Joi.string().email().required(),
      name: Joi.string(),
      scope: Joi.array()
    }
  },
  handler: async request => {
    try {
      return await User.create(request.payload)
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.forbidden(err)
    }
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
  tags: ['api'],
  validate: {
    params: {
      id: Joi.objectId()
    },
    payload: {
      name: Joi.string(),
      scope: Joi.array()
    }
  },
  handler: async request => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: request.params.id },
        request.payload,
        { new: true}
      )

      return user || Boom.notFound()
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.forbidden(err)
    }
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
  tags: ['api'],
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
