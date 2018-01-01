const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const server = require('../src/index.js')
const User = require('../src/models/users')

const fakeUser = require('./fixtures/users').fakeUser[0]

test('Before all', async () => {
  await server.liftOff()
})

test('Two users list', async t => {
  const options = {
    method: 'GET',
    url: '/users'
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
    url: '/users'
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').resolves([])

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 404, 'should return status code 404')
})

test('Get one user', async t => {
  const options = {
    method: 'GET',
    url: '/users/' + fakeUser.id
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
    url: '/users/' + fakeUser.id
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
    url: '/users/' + fakeUser.id
  }

  const userMock = sinon.mock(User)
  userMock.expects('findOne').rejects()

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 500, 'should return status code 500')
})

test('Use virtuals methods', t => {
  const userNewMock = new User(fakeUser)
  t.equal(userNewMock.firstname, fakeUser.firstname, 'Ok pour le prénom')
  t.equal(userNewMock.lastname, fakeUser.lastname, 'Ok pour le nom')

  t.end()
})

test('DELETE not allowed on users list', async t => {
  const options = {
    method: 'DELETE',
    url: '/users'
  }

  const res = await server.inject(options)
  t.equal(res.statusCode, 405, 'should return status code 405 not allowed')
})

test('Create a real user', async t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: 'me@me.comzkl', name: 'Jean kjh' }
  }

  const userMock = sinon.mock(User)
  userMock.expects('create').resolves(fakeUser)

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.result._id, fakeUser._id, 'ID is ok')
  t.equal(res.result.name, fakeUser.name, 'Name is ok')
  t.equal(res.result.scope, fakeUser.scope, 'Scope is ok')
})

test('Create a real user with errors', async t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: 'me@me.comzkl', name: 'Jean kjh' }
  }

  const userMock = sinon.mock(User)
  userMock.expects('create').rejects({ code: 11000 })

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 409, 'should return status code 409')
})

test('Create a real user with others errors', async t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: 'me@me.comzkl', name: 'Jean kjh' }
  }

  const userMock = sinon.mock(User)
  userMock.expects('create').rejects()


  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 403, 'should return status code 403')
})

test('POST an user with an id', async t => {
  const options = {
    method: 'POST',
    url: '/users/' + fakeUser.id
  }

  const res = await server.inject(options)
  t.equal(res.statusCode, 404, 'should return status code 404')
})

test('Remove an user', async t => {
  const options = {
    method: 'DELETE',
    url: '/users/' + fakeUser.id
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
    url: '/users/' + fakeUser.id
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
    url: '/users/' + fakeUser.id
  }

  const userMock = sinon.mock(User)
  userMock.expects('findOneAndRemove').withArgs({ _id: fakeUser.id })
    .rejects()

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 500, 'should return status code 500')
})

test('Users list with error', async t => {
  const options = {
    method: 'GET',
    url: '/users'
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').rejects()

  const res = await server.inject(options)
  userMock.verify()
  userMock.restore()

  t.equal(res.statusCode, 500, 'should return status code 500')
})
