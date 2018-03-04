const Utils = require('./utils')
const Users = require('../controllers/users')

// ## Users list

module.exports = [
  { method: 'GET', path: '/users', options: Users.list },
  { method: 'POST', path: '/users', options: Users.create },
  { method: 'DELETE', path: '/users', handler: Utils.notAllowed },

  { method: 'GET', path: '/users/{id}', options: Users.one },
  { method: 'PUT', path: '/users/{id}', options: Users.set },
  { method: 'DELETE', path: '/users/{id}', options: Users.remove }
]
