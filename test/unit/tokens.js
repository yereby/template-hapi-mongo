const test = require('tap').test

const { server, fixtureUsers } = require('../lib/init.js')

test('Before all', async () => {
  await server.liftOff()
})

test('Ask a token', async t => {
  const options = {
    method: 'POST',
    url: '/tokens',
    payload: { email: fixtureUsers[0].email }
  }

  const response = await server.inject(options)
  const regex = /^.+\..+\..+$/g
  const token = response.result.token

  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(regex.test(token), true, 'Token is correct')
})

