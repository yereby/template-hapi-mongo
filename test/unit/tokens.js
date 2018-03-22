const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, Auth, User, fixtureUsers  } = require('../lib/init.js')
const secretKey = 'TestingSecretKey'

test('Before all', async () => {
  server.bind({ secretKey })
  server.route(require('../../src/routes/tokens'))
  await server.initialize()
})

test('Ask a token', async t => {
  const options = {
    method: 'POST',
    url: '/tokens',
    payload: { email: fixtureUsers[0].email },
  }

  const userMock = sinon.mock(User)
  userMock.expects('findOne').resolves(fixtureUsers[0])

  const authMock = sinon.mock(Auth)
  authMock.expects('create').resolves(fixtureUsers[0])

  const response = await server.inject(options)
  userMock.verify()
  userMock.restore()
  authMock.verify()
  authMock.restore()

  const regex =  /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/g
  const token = response.result.token

  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(regex.test(token), true, 'Token is correct')
})

test('Revoke a token', async t => {
  const options = {
    method: 'DELETE',
    url: '/tokens',
    payload: {
      email: fixtureUsers[0].email,
      token: 'FalseToken',
    }
  }

  const authMock = sinon.mock(Auth)
  authMock.expects('remove').resolves({n: 1})

  const response = await server.inject(options)
  authMock.verify()
  authMock.restore()

  t.equal(response.statusCode, 204, 'status code = 204')
})

test('Revoke a non-existing token', async t => {
  const options = {
    method: 'DELETE',
    url: '/tokens',
    payload: {
      email: fixtureUsers[0].email,
      token: 'FalseToken',
    }
  }

  const authMock = sinon.mock(Auth)
  authMock.expects('remove').resolves({n: 0})

  const response = await server.inject(options)
  authMock.verify()
  authMock.restore()

  t.equal(response.statusCode, 404, 'status code = 404')
})
