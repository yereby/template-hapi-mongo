const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, User, Auth, fixtureUsers, tokens } = require('../lib/init.js')
const token = tokens.generateToken(fixtureUsers[0].email, process.env.SECRET_KEY)

test('Before all', async () => {
  await server.liftOff()
})

test('Home entry with users', async t => {
  const options = {
    method: 'GET',
    url: '/',
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  const authMock = sinon.mock(Auth)
  userMock.expects('find').resolves(fixtureUsers)
  authMock.expects('findOne').resolves(fixtureUsers[0])

  const response = await server.inject(options)
  userMock.verify()
  userMock.restore()
  authMock.verify()
  authMock.restore()

  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(response.payload.includes(fixtureUsers[0].name), true, 'User is present')
})

test('Home entry with no users', async t => {
  const options = {
    method: 'GET',
    url: '/',
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  const authMock = sinon.mock(Auth)
  userMock.expects('find').resolves([])
  authMock.expects('findOne').resolves(fixtureUsers[0])

  const response = await server.inject(options)
  userMock.verify()
  userMock.restore()
  authMock.verify()
  authMock.restore()

  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(response.payload.includes(fixtureUsers[0].name), false, 'User is not present')
  t.equal(response.payload.includes('No user'), true, 'No user')
})

test('Home entry with errors', async t => {
  const options = {
    method: 'GET',
    url: '/',
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  const authMock = sinon.mock(Auth)
  userMock.expects('find').throws()
  authMock.expects('findOne').resolves(fixtureUsers[0])

  const response = await server.inject(options)
  userMock.verify()
  userMock.restore()
  authMock.verify()
  authMock.restore()

  t.equal(response.statusCode, 500, 'status code = 500')
})
