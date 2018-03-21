const Boom = require('boom')

const User = require('../models/user')

/**
 * Show the list of all users
 *
 * @example GET /users/
 * @return {Object} The list of users || status code 404
 */
module.exports.list = {
  tags: ['api', 'home'],
  description: 'Display the list of users',
  handler: (require, h) => {
    return User.find({})
      .then(list => h.view('home/index', { list }) )
      .catch(err => Boom.badImplementation(err))
  }
}
