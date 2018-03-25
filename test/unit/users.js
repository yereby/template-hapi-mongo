const t = require('tap')
const sinon = require('sinon')

const { server, User, fixtureUsers } = require('../lib/init.js')
const fakeUser = fixtureUsers[0]

const sandbox = sinon.createSandbox()
t.afterEach(done => { sandbox.restore(); done() })

t.test('Before all', async () => {
  server.route(require('../../src/routes/users'))
  await server.initialize()
})


t.test('Two users list', async t => {
  const options = {
    method: 'GET',
    url: '/users',
  }

  sandbox.stub(User, 'find').returns(fixtureUsers)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.find)
  t.equal(res.statusCode, 200, 'should return status code 200')
  t.equal(res.result.length, 1, 'should return 1 result')
})

t.test('Empty users list', async t => {
  const options = {
    method: 'GET',
    url: '/users',
  }

  sandbox.stub(User, 'find').returns([])

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.find)
  t.equal(res.statusCode, 404, 'should return status code 404')
})

t.test('Users list with error', async t => {
  const options = {
    method: 'GET',
    url: '/users',
  }

  sandbox.stub(User, 'find').throws()

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.find)
  t.equal(res.statusCode, 500, 'should return status code 500')
})

t.test('Get one user', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'findOne').returns(fakeUser)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findOne)
  t.equal(res.statusCode, 200, 'should return status code 200')
  t.equal(res.result.name, fakeUser.name, 'User exists')
})

t.test('Get an user that does not exists', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'findOne').returns(null)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findOne)
  t.equal(res.statusCode, 404, 'should return status code 404')
})

t.test('Get an user with errors', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'findOne').throws()

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.findOne)
  t.equal(res.statusCode, 500, 'should return status code 500')
})

// # Create an user

/*
* Create a user with no errors
*
* POST /users
* { email: fakeUser.email, name: fakeUser.name }
*/
t.test('Create a real user', async t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: fakeUser.email, name: fakeUser.name },
  }

  sandbox.stub(User, 'create').returns(fakeUser)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.create)
  t.equal(res.statusCode, 204, 'Status code should be 204')
})

/*
* Create a user with mongodb duplicate error
*
* POST /users
* { email: fakeUser.email, name: fakeUser.name }
*/
t.test('Create a real user with errors', async t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: fakeUser.email, name: fakeUser.name },
  }

  sandbox.stub(User, 'create').throws({ code: 11000 })

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.create)
  t.equal(res.statusCode, 409, 'should return status code 409')
})

/*
* Create a user with mongodb insertion error
*
* POST /users
* { email: fakeUser.email, name: fakeUser.name }
*/
t.test('Create a real user with insertion error', async t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: fakeUser.email, name: fakeUser.name },
  }

  sandbox.stub(User, 'create').throws()

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.create)
  t.equal(res.statusCode, 500, 'should return status code 500')
})

// # Update an user

t.test('Update an existing user', async t => {
  const options = {
    method: 'PUT',
    url: '/users/' + fakeUser.id,
    payload: { name: fakeUser.name, scope: fakeUser.scope },
  }

  sandbox.stub(User, 'update').returns(fakeUser)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.update)
  t.equal(res.statusCode, 204, 'should return status code 204')
})

t.test('Update a non-existing user', async t => {
  const options = {
    method: 'PUT',
    url: '/users/' + fakeUser.id,
    payload: { name: fakeUser.name, scope: fakeUser.scope },
  }

  sandbox.stub(User, 'update').returns({ n: 0 })

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.update)
  t.equal(res.statusCode, 404, 'should return status code 404')
})

t.test('Update an user with wrong params', async t => {
  const options = {
    method: 'PUT',
    url: '/users/' + fakeUser.id,
    payload: { wrongParam: fakeUser.name },
  }

  const res = await server.inject(options)

  t.equal(res.statusCode, 400, 'should return status code 400')
})

// # Remove an user

t.test('Remove an user', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'remove').returns(fakeUser)

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.remove)
  t.equal(res.statusCode, 204, 'should return status code 204')
})

t.test('Remove an user that does not exists', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'remove').returns({ n: 0 })

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.remove)
  t.equal(res.statusCode, 404, 'should return status code 404')
})

t.test('Remove an user call with error', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id,
  }

  sandbox.stub(User, 'remove').throws()

  const res = await server.inject(options)

  sinon.assert.calledOnce(User.remove)
  t.equal(res.statusCode, 500, 'should return status code 500')
})
