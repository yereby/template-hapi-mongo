const Home = require('./home')
const Statics = require('./statics')
const Users = require('./users')
const Tokens = require('./tokens')

module.exports = [...Home, ...Statics, ...Users, ...Tokens]
