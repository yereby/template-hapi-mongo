const Home = require('../controllers/home')

module.exports = [{ method: 'GET', path: '/', options: Home.list }]
