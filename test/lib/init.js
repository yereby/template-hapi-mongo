const Hapi = require('hapi')

exports.server = new Hapi.Server({ port: process.env.PORT || 1337 })

module.exports.User = require('../../src/models/user')
module.exports.Auth = require('../../src/models/auth')
module.exports.fixtureUsers = require('../fixtures/users').fakeUser
