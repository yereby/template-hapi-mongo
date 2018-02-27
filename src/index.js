const Hapi = require('hapi')
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const isStandAlone = require.main === module

// # Plugins options

const goodOpts = {
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', response: '*' }]
    }, {
      module: 'good-console',
      args: [{ format: 'HH:mm:ss.SSS' }]
    }, 'stdout']
  }
}

const mongooseOpts = {
  uri: process.env.MONGOURI || 'mongodb://localhost/template-hapi',
  options: { connectTimeoutMS: 1000 }
}

// # Server configuration

const server = new Hapi.Server({ port: process.env.PORT || 1337 })

/**
 * Configure and launch the server.
 *
 * We register those plugins if the server is launched by
 * itself and not form an other script (tests or electron) :
 * - good
 * - mongoDBconnect
 */
server.liftOff = async function () {
  try {
    await server.register([
      require ('inert'),
      require('vision')
    ])

    server.views({
      engines: { pug: require('pug') },
      path: './src/views',
      compileOptions: { pretty: true },
      isCached: process.env.NODE_ENV === 'production'
    })

    server.route(require('./routes/index'))

    if (isStandAlone) {
      await server.register([
        { plugin: require('./plugins/DB'), options: mongooseOpts },
        { plugin: require('good'), options: goodOpts }
      ])

      await server.start()
      server.log('server', `Server started at ${server.info.uri}`)
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
if (isStandAlone) {
  (async () => await server.liftOff())()
}

// Handeling unhandled rejections
process.on('unhandledRejection', error => {
  console.log('--- Unhandled promise rejection', error)
})

module.exports = server
