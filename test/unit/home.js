const test = require('tap').test
const sinon = require('sinon')
const sandbox = sinon.createSandbox()

const { server, User, fixtureUsers } = require('../lib/init.js')

test('Before all', async () => {
  await server.register(require('vision'))

  server.views({
    engines: { pug: require('pug') },
    path: './src/views',
    compileOptions: { pretty: true },
    isCached: process.env.NODE_ENV === 'production'
  })

  server.route(require('../../src/routes/home'))
  await server.initialize()
})

test('Home entry with users', async t => {
  const options = {
    method: 'GET',
    url: '/',
  }

  sandbox.stub(User, 'find').returns(fixtureUsers)

  const response = await server.inject(options)
  sinon.assert.calledOnce(User.find)

  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(response.payload.includes(fixtureUsers[0].name), true, 'User is present')

  sandbox.restore()
})

test('Home entry with no users', async t => {
  const options = {
    method: 'GET',
    url: '/',
  }

  sandbox.stub(User, 'find').returns([])

  const response = await server.inject(options)

  sinon.assert.calledOnce(User.find)
  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(response.payload.includes(fixtureUsers[0].name), false, 'User is not present')
  t.equal(response.payload.includes('No user'), true, 'No user')

  sandbox.restore()
})

test('Home entry with errors', async t => {
  const options = {
    method: 'GET',
    url: '/',
  }

  sandbox.stub(User, 'find').throws()

  const response = await server.inject(options)
  sinon.assert.calledOnce(User.find)

  t.equal(response.statusCode, 500, 'status code = 500')

  sandbox.restore()
})
