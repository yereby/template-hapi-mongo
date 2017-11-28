const Boom = require('boom')

module.exports.notAllowed = () => {
  return Boom.methodNotAllowed()
}

module.exports.notFound = () => {
  return Boom.notFound()
}
