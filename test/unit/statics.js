const test = require('tap').test
const server = require('../../src/index.js')

test('Before all', async () => {
  await server.liftOff()
})

test('Get the favicon', async t => {
  const options = {
    method: 'GET',
    url: '/favicon.ico'
  }

  const response = await server.inject(options)
  t.equal(response.statusCode, 200, 'status code = 200')
})

test('Favicon does not exists', async t => {
  const options = {
    method: 'GET',
    url: '/brout.pnj'
  }

  const response = await server.inject(options)
  t.equal(response.statusCode, 404, 'status code = 404')
})
