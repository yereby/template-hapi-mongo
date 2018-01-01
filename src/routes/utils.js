const Boom = require('boom')

module.exports.notAllowed = () => {
  return Boom.methodNotAllowed()
}
