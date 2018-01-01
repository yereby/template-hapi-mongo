const Home = require('../controllers/home')

module.exports = [{ method: 'GET', path: '/', handler: Home.list }]
