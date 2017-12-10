const Hapi = require('hapi')
const good = require('good')
const inert = require ('inert')
const pug = require('pug')
const vision = require('vision')

const mongooseConnect = require('./plugins/DB')
const routes = require('./routes/index')

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

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

const mongooseOpts = {
  uri: 'mongodb://localhost/template-hapi',
  options: {
    useMongoClient: true,
    connectTimeoutMS: 1000
  }
}

const plugins = [
  // { plugin: good, options: goodOpts },
  { plugin: mongooseConnect, options: mongooseOpts },
  inert,
  vision
]

/////////////////////////////
// # Configuration du serveur
/////////////////////////////

const server = new Hapi.Server({
  port: process.env.PORT || 1337
})

async function liftOff () {
  await server.register(plugins)

  // Views
  server.views({
    engines: { pug },
    path: './src/views',
    compileOptions: { pretty: true },
    isCached: process.env.NODE_ENV === 'production'
  })

  // Routes
  server.route(routes)

  // ## Lancement du serveur
  try {
    await server.start()
    console.log(`Server started at ${server.info.uri}`)
  }
  catch (err) { console.error(err) }
}
liftOff()

module.exports = server
