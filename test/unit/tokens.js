const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, Auth, fixtureUsers } = require('../lib/init.js')

test('Before all', async () => {
  await server.liftOff()
})

test('Ask a token', async t => {
  const options = {
    method: 'POST',
    url: '/tokens',
    payload: { email: fixtureUsers[0].email }
  }

  const authMock = sinon.mock(Auth)
  authMock.expects('create').resolves(fixtureUsers[0])

  const response = await server.inject(options)
  authMock.verify()
  authMock.restore()

  const regex =  /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/g
  const token = response.result.token

  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(regex.test(token), true, 'Token is correct')
})

