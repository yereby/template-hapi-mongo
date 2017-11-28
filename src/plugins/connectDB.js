const db = require('mongoose')

module.exports.plugin = {
  name: 'hapiMongooseConnect',
  register: (server, options) => {
    db.connect(options.uri, options.options)

    db.connection.on('open', () => {
      server.log('database', 'Connection established to mongodb.')
    })

    db.connection.on('error', (err) => { throw err })
    db.connection.on('close', (err) => { throw err })
  }
}
