const tap = require('tap')
const sinon = require('sinon')
require('sinon-mongoose')

const server = require('../src/index.js')
const User = require('../src/models/users')

tap.beforeEach(async () => {
  await server.liftOff()
})

tap.test('Home entry', async t => {
  const options = {
    method: 'GET',
    url: '/'
  }

  const userMock = sinon.mock(User)
  userMock.expects('find').resolves({name: 'Hey'})

  const response = await server.inject(options)

  t.equal(response.statusCode, 200, 'status code = 200')
  t.equal(response.payload.includes('Welcome'), true, 'Text in page')
})
