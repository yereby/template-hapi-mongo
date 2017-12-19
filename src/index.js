const Hapi = require('hapi')

process.on('unhandledRejection', error => {
  console.log('Possibly Unhandled Rejection', error)
})

////////////
// # PLUGINS
////////////

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
  // { plugin: require('good'), options: goodOpts },
  require ('inert'),
  require('vision')
]

const routes = require('./routes/index')

/////////////////////////////
// # Configuration du serveur
/////////////////////////////

const servOptions = { port: process.env.PORT || 1337 }
if (module.parent) { servOptions.debug = { request: ['warn'] }}

const server = new Hapi.Server(servOptions)

server.liftOff = async function () {
  await server.register(plugins)

  server.views({
    engines: { pug: require('pug') },
    path: './src/views',
    compileOptions: { pretty: true },
    isCached: process.env.NODE_ENV === 'production'
  })

  server.route(routes)

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

// Server start
void async function () {
  if (!module.parent) { await server.liftOff() }
}()

module.exports = server
