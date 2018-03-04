const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, User, fixtureUsers } = require('../lib/init.js')

test('Before all', async () => {
  await server.liftOff()
})

test('Home entry with users', async t => {
  const options = {
    method: 'GET',
    url: '/'
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').resolves(fixtureUsers)

  const response = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(response.payload.includes(fixtureUsers[0].name), true, 'User is present')
})

test('Home entry with no users', async t => {
  const options = {
    method: 'GET',
    url: '/'
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').resolves([])

  const response = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(response.payload.includes(fixtureUsers[0].name), false, 'User is not present')
  t.equal(response.payload.includes('No user'), true, 'No user')
})

test('Home entry with errors', async t => {
  const options = {
    method: 'GET',
    url: '/'
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').throws()

  const response = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(response.statusCode, 500, 'status code = 500')
})
