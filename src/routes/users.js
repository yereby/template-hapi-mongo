const Users = require('../controllers/users')

module.exports = [
  { method: 'GET', path: '/users', options: Users.list },
  { method: 'POST', path: '/users', options: Users.create },

  { method: 'GET', path: '/users/{id}', options: Users.one },
  { method: 'PUT', path: '/users/{id}', options: Users.set },
  { method: 'DELETE', path: '/users/{id}', options: Users.remove }
]
