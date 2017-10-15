const Home = require('./home')
const Statics = require('./statics')
const Users = require('./users')

module.exports = [...Home, ...Statics, ...Users]
