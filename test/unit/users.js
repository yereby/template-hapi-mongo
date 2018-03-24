const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, User, fixtureUsers } = require('../lib/init.js')
const fakeUser = fixtureUsers[0]

test('Before all', async () => {
  server.route(require('../../src/routes/users'))
  await server.initialize()
})

test('Two users list', async t => {
  const options = {
    method: 'GET',
    url: '/users',
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').resolves(fixtureUsers)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 200, 'should return status code 200')
  t.equal(res.result.length, 1, 'should return 1 result')
})

test('Empty users list', async t => {
  const options = {
    method: 'GET',
    url: '/users',
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
  }

  const userMock = sinon.mock(User)
  userMock.expects('findById').resolves(fixtureUsers[0])

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
  }

  const userMock = sinon.mock(User)
  userMock.expects('findById').resolves(null)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 404, 'should return status code 404')
})

test('Get an user with errors', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
  }

  const userMock = sinon.mock(User)
  userMock.expects('findById').throws()

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 500, 'should return status code 500')
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
    payload: { email: fakeUser.email, name: fakeUser.name },
  }

  const userMock = sinon.mock(User)
  userMock.expects('create').resolves(fixtureUsers[0])

  const res= await server.inject(options)
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

test('Update an existing user', async t => {
  const options = {
    method: 'PUT',
    url: '/users/' + fakeUser.id,
    payload: { name: fakeUser.name, scope: fakeUser.scope },
  }

  const userMock = sinon.mock(User)
  userMock.expects('findByIdAndUpdate').resolves(fakeUser)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 200, 'should return status code 200')
  t.equal(res.result, fakeUser, 'Return is fakeUser')
})

test('Update a non-existing user', async t => {
  const options = {
    method: 'PUT',
    url: '/users/' + fakeUser.id,
    payload: { name: fakeUser.name, scope: fakeUser.scope },
  }

  const userMock = sinon.mock(User)
  userMock.expects('findByIdAndUpdate').resolves(null)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 404, 'should return status code 404')
})

test('Update an user with wrong params', async t => {
  const options = {
    method: 'PUT',
    url: '/users/' + fakeUser.id,
    payload: { wrongParam: fakeUser.name },
  }

  const res = await server.inject(options)

  t.equal(res.statusCode, 400, 'should return status code 400')
})

// # Remove an user

test('Remove an user', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
  }

  const userMock = sinon.mock(User)
  userMock.expects('findByIdAndRemove').resolves(fixtureUsers[0])

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 204, 'should return status code 204')
})

test('Remove an user that does not exists', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
  }

  const userMock = sinon.mock(User)
  userMock.expects('findByIdAndRemove').resolves(null)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 404, 'should return status code 404')
})

test('Remove an user call with error', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
  }

  const userMock = sinon.mock(User)
  userMock.expects('findByIdAndRemove').throws()

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 500, 'should return status code 500')
})
