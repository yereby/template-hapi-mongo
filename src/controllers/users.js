const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const User = require('../models/user')

/**
 * Show the list of all users
 *
 * @example GET /users/
 *
 * @return {Object} The list of users || status code 404
 */
module.exports.list =  {
  tags: ['api', 'users'],
  description: 'List all users',
  plugins: { 'hapi-swagger': { order: 1, } },
  handler: async () => {
    try {
      const users = await User.find({})

      if (!users.length) { return Boom.notFound() }
      return users
    } catch(err) { return Boom.badImplementation(err) }
  }
}

/**
 * Show one user infos
 *
 * @example GET /users/{ObjectId}
 *
 * @return {Object} User infos || status code 404
 */
module.exports.one = {
  tags: ['api', 'users'],
  description: 'Get the infos of one user',
  plugins: { 'hapi-swagger': { order: 2, } },
  validate: {
    params: {
      id: Joi.objectId().description('Id of the user to show')
    }
  },
  handler: async request => {
    try {
      const user = await User.findOne({_id: request.params.id })

      if (!user) { return Boom.notFound() }
      return user
    } catch(err) { return Boom.badImplementation(err) }
  }
}

/**
 * Create one user
 *
 * If the email already exists we return a 409 status code
 *
 * @example POST /users
 *
 * @return {Object} User created || Some errors
 */
module.exports.create = {
  auth: false,
  tags: ['api', 'users'],
  description: 'Create a new user',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 3, } },
  validate: {
    payload: {
      email: Joi.string().email().required().description('Email of the new user'),
      name: Joi.string().description('Name of the new user'),
      scope: Joi.array().items(['user', 'admin']).default(['user']).description('Rights of the new user'),
    }
  },
  handler: async (request, h) => {
    try {
      await User.create(request.payload)
      return h.response().code(204)
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.badImplementation(err)
    }
  }
}

/**
 * Update one user's informations
 *
 * @example PUT /users/{ObjectId}
 *
 * @return {Object} User removed || status code 404
 */
module.exports.set = {
  tags: ['api', 'users'],
  description: 'Update an user',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 4, } },
  validate: {
    params: {
      id: Joi.objectId().description('Id of the user to update')
    },
    payload: {
      name: Joi.string().description('New name for the user'),
      scope: Joi.array().items(['user', 'admin']).description('Scope of the user')
    }
  },
  handler: async (request, h) => {
    try {
      const update = await User.update(
        { _id: request.params.id },
        request.payload,
        { runValidators: true },
      )
      if (update.n === 0) { return Boom.notFound() }

      return h.response().code(204)
    } catch(err) { return Boom.badImplementation(err) }
  }
}

/**
 * Remove one user
 *
 * @example DELETE /users/{ObjectId}
 *
 * @return {Object} User removed || status code 404
 */
module.exports.remove = {
  tags: ['api', 'users'],
  description: 'Remove an user',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 5, } },
  validate: {
    params: {
      id: Joi.objectId().description('Id of the user to remove')
    }
  },
  handler: async (request, h) => {
    try {
      const remove = await User.remove({_id: request.params.id })
      if (remove.n === 0) { return Boom.notFound() }

      return h.response().code(204)
    } catch(err) { return Boom.badImplementation(err) }
  }
}
