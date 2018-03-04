const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, User, fixtureUsers, tokens } = require('../lib/init.js')
const token = tokens.generateToken(fixtureUsers[0].email, process.env.SECRET_KEY)
const fakeUser = fixtureUsers[0]

test('Before all', async () => {
  await server.liftOff()
})

test('Two users list', async t => {
  const options = {
    method: 'GET',
    url: '/users',
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').resolves([fakeUser, fakeUser])

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 200, 'should return status code 200')
  t.equal(res.result.length, 2, 'should return 2 results')
})

test('Empty users list', async t => {
  const options = {
    method: 'GET',
    url: '/users',
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').resolves([])

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 404, 'should return status code 404')
})

test('Users list with error', async t => {
  const options = {
    method: 'GET',
    url: '/users',
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').throws()

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 500, 'should return status code 500')
})

test('Get one user', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  userMock.expects('findOne').resolves(fakeUser)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 200, 'should return status code 200')
  t.equal(res.result.name, fakeUser.name, 'User exists')
})

test('Get an user that does not exists', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  userMock.expects('findOne').resolves(null)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 404, 'should return status code 404')
})

test('Get an user with errors', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  userMock.expects('findOne').throws()

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 500, 'should return status code 500')
})

test('DELETE not allowed on users list', async t => {
  const options = {
    method: 'DELETE',
    url: '/users',
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const res = await server.inject(options)
  t.equal(res.statusCode, 405, 'should return status code 405 not allowed')
})

// # Create an user

/*
 * Create a user with no errors
 *
 * POST /users
 * { email: fakeUser.email, name: fakeUser.name }
 */
test('Create a real user', async t => {
  const options = {
    method: 'POST',
    url: '/users',
    headers: { 'Authorization': `Bearer ${token}` },
    payload: { email: fakeUser.email, name: fakeUser.name },
  }

  const userMock = sinon.mock(User)
  userMock.expects('create').resolves(fakeUser)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.result._id, fakeUser._id, 'ID is ok')
  t.equal(res.result.name, fakeUser.name, 'Name is ok')
  t.equal(res.result.scope, fakeUser.scope, 'Scope is defined')
})

/*
 * Create a user with mongodb duplicate error
 *
 * POST /users
 * { email: fakeUser.email, name: fakeUser.name }
 */
test('Create a real user with errors', async t => {
  const options = {
    method: 'POST',
    url: '/users',
    headers: { 'Authorization': `Bearer ${token}` },
    payload: { email: fakeUser.email, name: fakeUser.name },
  }

  const userMock = sinon.mock(User)
  userMock.expects('create').throws({ code: 11000 })

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 409, 'should return status code 409')
})

/*
 * Create a user with mongodb insertion error
 *
 * POST /users
 * { email: fakeUser.email, name: fakeUser.name }
 */
test('Create a real user with insertion error', async t => {
  const options = {
    method: 'POST',
    url: '/users',
    headers: { 'Authorization': `Bearer ${token}` },
    payload: { email: fakeUser.email, name: fakeUser.name },
  }

  const userMock = sinon.mock(User)
  userMock.expects('create').throws()

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 403, 'should return status code 403')
})

// # Update an user

// # Remove an user

test('Remove an user', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  userMock.expects('findOneAndRemove').withArgs({ _id: fakeUser.id })
    .resolves(fakeUser)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 200, 'should return status code 200')
})

test('Remove an user that does not exists', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  userMock.expects('findOneAndRemove').withArgs({ _id: fakeUser.id })
    .resolves(null)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 404, 'should return status code 404')
})

test('Remove an user call with error', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
    headers: { 'Authorization': `Bearer ${token}` },
  }

  const userMock = sinon.mock(User)
  userMock.expects('findOneAndRemove').withArgs({ _id: fakeUser.id })
    .throws()

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 500, 'should return status code 500')
})
