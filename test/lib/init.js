const Hapi = require('hapi')

exports.server = new Hapi.Server({ debug: false })

module.exports.User = require('../../src/models/user')
module.exports.Auth = require('../../src/models/auth')
module.exports.fixtureUsers = require('../fixtures/users').fakeUser
module.exports.generateToken = require('../../src/controllers/tokens').generateToken
