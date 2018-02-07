const db = require('mongoose')

module.exports.plugin = {
  name: 'mongoDBConnect',
  register: async (server, options) => {
    db.connect(options.uri, options.options)

    db.connection.on('open', () => {
      server.log('server', 'Connection established to mongodb')
    })

    db.connection.on('error', err => { throw err })
    db.connection.on('close', err => { throw err })
  }
}
