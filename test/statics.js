const test = require('tap').test
const server = require('../src/index')

test('Point d\'entrée pour voir le favicon', t => {
  const options = {
    method: 'GET',
    url: '/favicon.ico'
  }

  server.inject(options, response => {
    t.equal(response.statusCode, 200, 'status code = 200')
    t.end()
  })
})

test('Point d\'entrée pour un fichier qui n\'existe pas', t => {
  const options = {
    method: 'GET',
    url: '/brout.pnj'
  }

  server.inject(options, response => {
    t.equal(response.statusCode, 404, 'status code = 404')
    t.end()
  })
})
