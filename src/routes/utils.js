const Boom = require('boom')

module.exports.notAllowed = (request, reply) => {
  reply(Boom.methodNotAllowed())
}

module.exports.notFound = (request, reply) => {
  reply(Boom.notFound())
}
