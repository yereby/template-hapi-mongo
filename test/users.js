const test = require('tap').test
const server = require('../src/index')
const User = require('../src/models/users.js')
const sinon = require('sinon')
require('sinon-mongoose')

const fakeUser = {
  _id: '12345',
  name: 'Fake John',
  email: 'fake@john.com',
  firstname: 'Fake',
  lastname: 'John',
  scope: [ 'user' ]
}

test('Two users list', t => {
  const options = {
    method: 'GET',
    url: '/users'
  }

  const userMock = sinon.mock(User)
  userMock
    .expects('find')
    .resolves([fakeUser, fakeUser])

  server.inject(options, res => {
    userMock.verify()
    userMock.restore()

    t.equal(res.statusCode, 200, 'should return status code 200')
    t.equal(res.result.length, 2, 'should return 2 results')
    t.end()
  })
})


test('Empty users list', t => {
  const options = {
    method: 'GET',
    url: '/users'
  }

  const userMock = sinon.mock(User)
  userMock
    .expects('find')
    .resolves([])

  server.inject(options, res => {
    userMock.verify()
    userMock.restore()

    t.equal(res.statusCode, 404, 'should return status code 404')
    t.end()
  })
})

// Nop
test('Find one user', t => {
  const userMock = sinon.mock(User)
  userMock
    .expects('find').withArgs({ email: fakeUser.email })
    .resolves([fakeUser])

  User.find({ email: fakeUser.email })
    .then(docs => {
      userMock.verify()
      userMock.restore()

      t.equal(docs.length, 1, 'Un tableau d\'un user')
      t.equal(docs[0].name, fakeUser.name, 'le nom est bon')

      t.end()
    })
    .catch(t.end)
})

test('Use virtuals methods', t => {
  const userNewMock = new User(fakeUser)
  t.equal(userNewMock.firstname, fakeUser.firstname, 'Ok pour le prénom')
  t.equal(userNewMock.lastname, fakeUser.lastname, 'Ok pour le nom')

  t.end()
})

test('Create one user', t => {
  const userNewMock = sinon.mock(new User(fakeUser))
  userNewMock
    .expects('save')
    .resolves(true)

  userNewMock.object.create()
    .then(res => {
      userNewMock.verify()
      userNewMock.restore()

      t.equal(res, true, 'User créé')

      t.end()
    })
    .catch(t.end)
})

test('DELETE not allowed on users list', t => {
  const options = {
    method: 'DELETE',
    url: '/users'
  }

  server.inject(options, res => {
    t.equal(res.statusCode, 405, 'should return status code 405 not allowed')
    t.end()
  })
})

test('Create a real user', t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: 'me@me.comzkl', name: 'Jean kjh' }
  }

  const userMock = sinon.mock(User)
  userMock
    .expects('create')
    .resolves(fakeUser)

  server.inject(options)
    .then(res => {
      userMock.verify()
      userMock.restore()

      t.equal(res.result._id, fakeUser._id, 'ID is ok')
      t.equal(res.result.name, fakeUser.name, 'Name is ok')
      t.equal(res.result.scope, fakeUser.scope, 'Scope is ok')
    })
    .catch(t.threw).then(t.end)
})

test('Create a real user with errors', t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: 'me@me.comzkl', name: 'Jean kjh' }
  }

  const userMock = sinon.mock(User)
  userMock
    .expects('create')
    .rejects({ code: 11000 })

  server.inject(options)
    .then(res => {
      userMock.verify()
      userMock.restore()

      t.equal(res.statusCode, 409, 'should return status code 409')
    })
    .catch(t.threw).then(t.end)
})

test('Create a real user with others errors', t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: 'me@me.comzkl', name: 'Jean kjh' }
  }

  const userMock = sinon.mock(User)
  userMock
    .expects('create')
    .rejects()

  server.inject(options)
    .then(res => {
      userMock.verify()
      userMock.restore()

      t.equal(res.statusCode, 403, 'should return status code 403')
    })
    .catch(t.threw).then(t.end)
})

test('Create a real user with payload errors', t => {
  const options = {
    method: 'POST',
    url: '/users',
    payload: { email: 'me@me.com' }
  }

  server.inject(options)
    .then(res => {
      t.equal(res.statusCode, 400, 'should return status code 400')
    })
    .catch(t.threw).then(t.end)
})

test('POST an user with an id', t => {
  const options = {
    method: 'POST',
    url: '/users/12345'
  }

  server.inject(options, res => {
    t.equal(res.statusCode, 404, 'should return status code 404')
    t.end()
  })
})

test('Remove an user', t => {
  const options = {
    method: 'DELETE',
    url: '/users/12345'
  }

  const userMock = sinon.mock(User)
  userMock
    .expects('remove').withArgs({ _id: '12345' })
    .resolves({})

  server.inject(options, res => {
    userMock.verify()
    userMock.restore()

    t.equal(res.statusCode, 200, 'should return status code 200')
    t.end()
  })
})

test('Remove an user that does not exists', t => {
  const options = {
    method: 'DELETE',
    url: '/users/12345'
  }

  const userMock = sinon.mock(User)
  userMock
    .expects('remove').withArgs({ _id: '12345' })
    .resolves({ result: { n: 0, ok: 1 }})

  server.inject(options)
    .then(res => {
      userMock.verify()
      userMock.restore()

      t.equal(res.statusCode, 404, 'should return status code 404')
      t.end()
    })
    .catch(t.error)
})

test('Remove an user call with error', t => {
  const options = {
    method: 'DELETE',
    url: '/users/12345'
  }

  const userMock = sinon.mock(User)
  userMock
    .expects('remove').withArgs({ _id: '12345' })
    .rejects()

  server.inject(options)
    .then(res => {
      userMock.verify()
      userMock.restore()

      t.equal(res.statusCode, 500, 'should return status code 500')
      t.end()
    })
})

test('Users list with error', t => {
  const options = {
    method: 'GET',
    url: '/users'
  }

  const userMock = sinon.mock(User)
  userMock
    .expects('find')
    .rejects()

  server.inject(options, res => {
    userMock.verify()
    userMock.restore()

    t.equal(res.statusCode, 500, 'should return status code 500')
    t.end()
  })
})
