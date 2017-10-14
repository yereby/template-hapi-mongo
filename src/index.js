const Hapi = require('hapi')
const good = require('good')
const inert = require ('inert')
const pug = require('pug')
const vision = require('vision')
const hapiMongooseConnect = require('./plugins/connectDB')

const PRODUCTION = process.env.NODE_ENV === 'production'

if (!PRODUCTION) { require('dotenv').config() }

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

const hapiMongooseConnectOpts = {
  uri: 'mongodb://localhost/template',
  options: {
    useMongoClient: true,
    connectTimeoutMS: 1000
  }
}

// ## Inscription des plugins

const plugins = [
  { register: good, options: (!module.parent ? goodOpts : null) }, // Process monitoring
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

if (!process.env.DEBUG && !PRODUCTION) {
  server.log('warn', 'There is no DEBUG env variable.')
  server.log('warn', 'You may want to create a .env file first.')
}

if (!module.parent) {
  server.register({ register: hapiMongooseConnect, options: hapiMongooseConnectOpts }, (err) => {
    if (err) { throw err }
  })

  server.start((err) => {
    if (err) { throw err }

    debug(`Server started at ${server.info.uri}`)
  })
}

module.exports = server
