const Utils = require('./utils')
const Users = require('../controllers/users')

// ## Users list

module.exports = [
  { method: 'GET', path: '/users', handler: Users.list },
  { method: 'POST', path: '/users', options: Users.create },
  { method: 'POST', path: '/users/{id}', options: Users.set },
  { method: 'DELETE', path: '/users/{id}', handler: Users.remove },
  { method: 'DELETE', path: '/users', handler: Utils.notAllowed }
]
