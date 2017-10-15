const test = require('tap').test
const server = require('../src/index')

test('Point d\'entrée de la home', t => {
  const options = {
    method: 'GET',
    url: '/'
  }

  server.inject(options, response => {
    const stringTest = response.payload.includes('Welcome to the Hapijs template.')

    t.equal(response.statusCode, 200, 'status code = 200')
    t.equal(stringTest, true, 'texte dans la page')
    t.end()
  })
})
