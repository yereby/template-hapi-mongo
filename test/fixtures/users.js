const faker = require('faker/locale/fr')

module.exports.fakeUser = [{
  id: '5a2d6ae97ce8991926bfccb6',
  name: faker.name.findName(),
  email: faker.internet.email(),
  scope: [ 'user' ]
}]
