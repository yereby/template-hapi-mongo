// ## Home page

module.exports = [{
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply.view('home/index.pug')
  }
}]
