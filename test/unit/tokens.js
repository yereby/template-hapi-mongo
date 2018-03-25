const t = require('tap')
const sinon = require('sinon')

const { server, Auth, User, fixtureUsers  } = require('../lib/init.js')
const fakeUser = fixtureUsers[0]

const secretKey = 'TestingSecretKey'

const sandbox = sinon.createSandbox()
t.afterEach(done => { sandbox.restore(); done() })

t.test('Before all', async () => {
  server.bind({ secretKey })
  server.route(require('../../src/routes/tokens'))
  await server.initialize()
})

t.test('Ask a token', async t => {
  const options = {
    method: 'POST',
    url: '/tokens',
    payload: { email: fakeUser.email },
  }

  sandbox.stub(User, 'findOne').returns(fakeUser)
  sandbox.stub(Auth, 'create').returns(fakeUser)

  const response = await server.inject(options)

  const regex =  /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/g
  const token = response.result.token

  sinon.assert.calledOnce(User.findOne)
  sinon.assert.calledOnce(Auth.create)
  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(regex.test(token), true, 'Token is correct')
})

t.test('Ask a non-existant token', async t => {
  const options = {
    method: 'POST',
    url: '/tokens',
    payload: { email: fakeUser.email },
  }

  sandbox.stub(User, 'findOne').returns(null)

  const response = await server.inject(options)

  sinon.assert.calledOnce(User.findOne)
  t.equal(response.statusCode, 404, 'status code = 404')
})

t.test('Revoke a token', async t => {
  const options = {
    method: 'DELETE',
    url: '/tokens',
    payload: {
      email: fakeUser.email,
      token: 'FalseToken',
    }
  }

  sandbox.stub(Auth, 'remove').returns({ n: 1 })

  const response = await server.inject(options)

  sinon.assert.calledOnce(Auth.remove)
  t.equal(response.statusCode, 204, 'status code = 204')
})

t.test('Revoke a non-existing token', async t => {
  const options = {
    method: 'DELETE',
    url: '/tokens',
    payload: {
      email: fakeUser.email,
      token: 'FalseToken',
    }
  }

  sandbox.stub(Auth, 'remove').returns({ n: 0 })

  const response = await server.inject(options)

  sinon.assert.calledOnce(Auth.remove)
  t.equal(response.statusCode, 404, 'status code = 404')
})

t.test('Check connection URL', async t => {
  const options = {
    method: 'GET',
    url: '/tokens/' + 'aToken',
  }

  sandbox.stub(Auth, 'findOne').returns(fakeUser)

  const response = await server.inject(options)

  sinon.assert.calledOnce(Auth.findOne)
  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(response.result.isValid, true, 'Token is valid')
})

t.test('Check connection with a bad token', async t => {
  const options = {
    method: 'GET',
    url: '/tokens/' + 'aToken',
  }

  sandbox.stub(Auth, 'findOne').returns(null)

  const response = await server.inject(options)

  sinon.assert.calledOnce(Auth.findOne)
  t.equal(response.statusCode, 401, 'status code = 401')
})
