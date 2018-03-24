const test = require('tap').test
const sinon = require('sinon')
const sandbox = sinon.createSandbox()

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

  sandbox.stub(User, 'findOne').returns(fixtureUsers[0])
  sandbox.stub(Auth, 'create').returns(fixtureUsers[0])

  const response = await server.inject(options)

  const regex =  /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/g
  const token = response.result.token

  sinon.assert.calledOnce(User.findOne)
  sinon.assert.calledOnce(Auth.create)
  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(regex.test(token), true, 'Token is correct')

  sandbox.restore()
})

test('Ask a non-existant token', async t => {
  const options = {
    method: 'POST',
    url: '/tokens',
    payload: { email: fixtureUsers[0].email },
  }

  sandbox.stub(User, 'findOne').returns(null)

  const response = await server.inject(options)

  sinon.assert.calledOnce(User.findOne)
  t.equal(response.statusCode, 404, 'status code = 404')

  sandbox.restore()
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

  sandbox.stub(Auth, 'remove').returns({ n: 1 })

  const response = await server.inject(options)

  sinon.assert.calledOnce(Auth.remove)
  t.equal(response.statusCode, 204, 'status code = 204')

  sandbox.restore()
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

  sandbox.stub(Auth, 'remove').returns({ n: 0 })

  const response = await server.inject(options)

  sinon.assert.calledOnce(Auth.remove)
  t.equal(response.statusCode, 404, 'status code = 404')

  sandbox.restore()
})
