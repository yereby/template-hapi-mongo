const Hapi = require('hapi')
const good = require('good')
const inert = require ('inert')
const pug = require('pug')
const vision = require('vision')

const PRODUCTION = process.env.NODE_ENV === 'production'

if (!PRODUCTION) { require('dotenv').config() }

if (!process.env.DEBUG) {
  /* eslint-disable no-console */
  console.log('There is no DEBUG env variable, you may want to create a .env file first.')
  console.log('See the README.')
  /* eslint-enable no-console */
}

const debug = require('debug')('app:server')
const routes = require('./routes/index')

////////////
// # PLUGINS
////////////

// ## Options des plugins

const goodOpts = {
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', response: '*' }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
}

// ## Inscription des plugins

const plugins = [
  { register: good, options: goodOpts }, // Process monitoring
  inert, // Static file and directory handlers
  vision
]

/////////////////////////////
// # Configuration du serveur
/////////////////////////////

const server = new Hapi.Server()

// Options
server.connection({ port: process.env.PORT || 1337 })

// Plugins
server.register(plugins, (err) => { if (err) { throw err } })

// Views
server.views({
  engines: { pug },
  path: './src/views',
  compileOptions: {
    pretty: true
  },
  isCached: PRODUCTION,
  context: { PRODUCTION }
})

// Routes
server.route(routes)

// ## Lancement du serveur

if (!module.parent) {
  // Prod database
  server.register(require('./models/connection'), (err) => { if (err) { throw err } })

  server.start((err) => {
    if (err) { throw err }

    debug(`Server started at ${server.info.uri}`)
  })
} else {
  // Test database
  server.register(require('./models/connectionTest'), (err) => { if (err) { throw err } })
}

module.exports = server
