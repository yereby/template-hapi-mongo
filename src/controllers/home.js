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
  handler: (require, h) => {
    return User.find({})
      .then(list => h.view('home/index', { list }) )
      .catch(err => Boom.badImplementation(err))
  }
}
