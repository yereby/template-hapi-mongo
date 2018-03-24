const test = require('tap').test
const sinon = require('sinon')
const sandbox = sinon.createSandbox()

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

  sandbox.stub(User, 'find').returns(fixtureUsers)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.find)
  t.equal(res.statusCode, 200, 'should return status code 200')
  t.equal(res.result.length, 1, 'should return 1 result')

  sandbox.restore()
})

test('Empty users list', async t => {
  const options = {
    method: 'GET',
    url: '/users',
  }

  sandbox.stub(User, 'find').returns([])

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.find)
  t.equal(res.statusCode, 404, 'should return status code 404')

  sandbox.restore()
})

test('Users list with error', async t => {
  const options = {
    method: 'GET',
    url: '/users',
  }

  sandbox.stub(User, 'find').throws()

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.find)
  t.equal(res.statusCode, 500, 'should return status code 500')

  sandbox.restore()
})

test('Get one user', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'findById').returns(fixtureUsers[0])

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findById)
  t.equal(res.statusCode, 200, 'should return status code 200')
  t.equal(res.result.name, fakeUser.name, 'User exists')

  sandbox.restore()
})

test('Get an user that does not exists', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'findById').returns(null)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findById)
  t.equal(res.statusCode, 404, 'should return status code 404')

  sandbox.restore()
})

test('Get an user with errors', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'findById').throws()

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findById)
  t.equal(res.statusCode, 500, 'should return status code 500')

  sandbox.restore()
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

  sandbox.stub(User, 'create').returns(fixtureUsers[0])

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.create)
  t.equal(res.statusCode, 204, 'Status code should be 204')

  sandbox.restore()
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

  sandbox.stub(User, 'create').throws({ code: 11000 })

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.create)
  t.equal(res.statusCode, 409, 'should return status code 409')

  sandbox.restore()
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

  sandbox.stub(User, 'create').throws()

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.create)
  t.equal(res.statusCode, 500, 'should return status code 500')

  sandbox.restore()
})

// # Update an user

test('Update an existing user', async t => {
  const options = {
    method: 'PUT',
    url: '/users/' + fakeUser.id,
    payload: { name: fakeUser.name, scope: fakeUser.scope },
  }

  sandbox.stub(User, 'findByIdAndUpdate').returns(fakeUser)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findByIdAndUpdate)
  t.equal(res.statusCode, 200, 'should return status code 200')
  t.equal(res.result, fakeUser, 'Return is fakeUser')

  sandbox.restore()
})

test('Update a non-existing user', async t => {
  const options = {
    method: 'PUT',
    url: '/users/' + fakeUser.id,
    payload: { name: fakeUser.name, scope: fakeUser.scope },
  }

  sandbox.stub(User, 'findByIdAndUpdate').returns(null)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findByIdAndUpdate)
  t.equal(res.statusCode, 404, 'should return status code 404')

  sandbox.restore()
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

  sandbox.stub(User, 'findByIdAndRemove').returns(fixtureUsers[0])

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findByIdAndRemove)
  t.equal(res.statusCode, 204, 'should return status code 204')

  sandbox.restore()
})

test('Remove an user that does not exists', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'findByIdAndRemove').returns(null)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findByIdAndRemove)
  t.equal(res.statusCode, 404, 'should return status code 404')

  sandbox.restore()
})

test('Remove an user call with error', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'findByIdAndRemove').throws()

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findByIdAndRemove)
  t.equal(res.statusCode, 500, 'should return status code 500')

  sandbox.restore()
})
