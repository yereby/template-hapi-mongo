const Hapi = require('hapi')

// Handeling unhandled rejections
process.on('unhandledRejection', error => {
  console.log('Unhandled promise rejection', error)
})

// # Plugins

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

const mongooseOpts = {
  uri: 'mongodb://localhost/template-hapi',
  options: {
    useMongoClient: true,
    connectTimeoutMS: 1000
  }
}

const plugins = [
  { plugin: require('good'), options: goodOpts },
  require ('inert'),
  require('vision')
]

// # Server configuration

const servOptions = { port: process.env.PORT || 1337 }
if (module.parent) { servOptions.debug = { request: ['warn'] }}

const server = new Hapi.Server(servOptions)

/**
 * Configure and launch the server.
 *
 * If the server is launched by the tests,
 * we do not start it, we initialize it.
 *
 * If the server is launched by itself,
 * we also register the database connection plugin
 */
server.liftOff = async function () {
  await server.register(plugins)

  server.views({
    engines: { pug: require('pug') },
    path: './src/views',
    compileOptions: { pretty: true },
    isCached: process.env.NODE_ENV === 'production'
  })

  server.route(require('./routes/index'))

  try {
    if (!module.parent) {
      await server.register({ plugin: require('./plugins/DB'), options: mongooseOpts })
      await server.start()
      console.log(`Server started at ${server.info.uri}`)
    } else {
      await server.initialize()
    }
  } catch (err) { throw err }
}

// # Server start

/**
 * We immediately call liftOff only if
 * the server is not launched from tests
 */
if (!module.parent) {
  (async () => { await server.liftOff() })()
}

module.exports = server
