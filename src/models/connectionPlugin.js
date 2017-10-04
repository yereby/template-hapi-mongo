const db = require('mongoose')

function register(server, options, next) {
  db.connect(options.uri, options.options)

  db.connection.on('open', () => {
    server.log('database', 'Connection established to mongodb.')
  })

  db.connection.on('error', (err) => { throw err })
  db.connection.on('close', (err) => { throw err })

  next()
}

register.attributes = { name: 'hapiMongooseConnect' }
module.exports = register
