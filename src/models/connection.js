const db = require('mongoose')
const debug = require('debug')('app:mongoose')

function connection(server, options, next) {
  db.connect('mongodb://localhost/template', {
    useMongoClient: true
  })

  db.connection.on('open', () => {
    debug('Connection established to mongodb.')
  })

  db.connection.on('error', () => {
    debug('Connection to mongodb NOK! :(')
    process.exit(1)
  })

  db.connection.on('close', () => {
    debug('Closing database connection.')
    process.exit(1)
  })

  next()
}

connection.attributes = { name: 'Connection' }
module.exports = connection
