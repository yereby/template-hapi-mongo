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

const secretKey = process.env.SECRET_KEY || 'Choose a secured Secret Key'
server.bind({ secretKey })

async function validate(decoded) {
  try {
    const Auth = require('./models/auth')
    const result = await Auth.findOne({ email: decoded.email, iat: decoded.iat })

    if (!result) { return { isValid: false } }
    return { isValid: true }
  } catch(err) { throw err }
}

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
      require('hapi-auth-jwt2'),
      require ('inert'),
      require('vision'),
      require('hapi-swagger'),
    ])

    server.ext('onPreResponse', (request, h) => {
      const response = request.response
      if (response.isBoom) { return h.continue }

      if (request.auth.isAuthenticated) {
        response.headers.Authorization = request.auth.token
      }

      return h.continue
    })

    server.auth.strategy('jwt', 'jwt', {
      key: secretKey,
      validate: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }
    })

    server.auth.default('jwt')

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
