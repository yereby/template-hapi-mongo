const test = require('tape')
const server = require('../src/index')

test('Point d\'entrée de la home', assert => {
  const options = {
    method: 'GET',
    url: '/'
  }

  server.inject(options, response => {
    const stringTest = response.payload.includes('Welcome to the Hapijs template.')

    assert.equal(response.statusCode, 200, 'status code = 200')
    assert.equal(stringTest, true, 'texte dans la page')
    assert.end()
  })
})

test.onFinish(() => process.exit(0))
