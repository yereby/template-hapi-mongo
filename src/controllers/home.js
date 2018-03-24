const Boom = require('boom')

const User = require('../models/user')

/**
 * Show the homepage
 * With the list of all users
 *
 * @example GET /
 */
module.exports.list = {
  tags: ['api', 'home'],
  description: 'Display the list of users',
  handler: async (require, h) => {
    try {
      const list = await User.find({})
      return h.view('home/index', { list })
    } catch(err) { return Boom.badImplementation(err) }
  }
}
