const Statics = require('../controllers/statics')

module.exports = [
  { method: 'GET', path: '/{param*}', handler: Statics.static }
]
