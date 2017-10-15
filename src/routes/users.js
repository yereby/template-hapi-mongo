const Utils = require('./utils')
const Users = require('../controllers/users')

// ## Users list

module.exports = [
  { method: 'GET', path: '/users', handler: Users.list },
  { method: 'POST', path: '/users', config: Users.signup },
  { method: 'DELETE', path: '/users', handler: Utils.notAllowed },
  { method: 'POST', path: '/users/{id}', handler: Utils.notFound },
  { method: 'DELETE', path: '/users/{id}', handler: Users.remove }
]
