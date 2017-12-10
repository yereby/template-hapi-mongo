// ## Home page

const Users = require('../controllers/users.js')

module.exports = [{
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return Users.list()
      .then(list => h.view('home/index', { list }) )
  }
}]
