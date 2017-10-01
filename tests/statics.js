const test = require('tape')
const server = require('../src/index')

test('Point d\'entrée pour voir le favicon', assert => {
  const options = {
    method: 'GET',
    url: '/favicon.ico'
  }

  server.inject(options, response => {
    assert.equal(response.statusCode, 200, 'status code = 200')
    assert.end()
  })
})

test('Point d\'entrée pour un fichier qui n\'existe pas', assert => {
  const options = {
    method: 'GET',
    url: '/brout.pnj'
  }

  server.inject(options, response => {
    assert.equal(response.statusCode, 404, 'status code = 404')
    assert.end()
  })
})
