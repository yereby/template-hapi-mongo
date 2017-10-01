const db = require('mongoose')
const debug = require('debug')('app:mongoose')

function connection(server, options, next) {
  db.connect('mongodb://localhost/templateTest', {
    useMongoClient: true
  })

  db.connection.on('open', () => {
    debug('Connection established to TEST mongodb.')
  })

  db.connection.on('error', () => {
    debug('Connection to TEST mongodb NOK! :(')
    process.exit(1)
  })

  db.connection.on('close', () => {
    debug('Closing TEST database connection.')
    process.exit(1)
  })

  next()
}

connection.attributes = { name: 'ConnectionTest' }
module.exports = connection
