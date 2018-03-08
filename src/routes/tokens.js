const Tokens = require('../controllers/tokens')

module.exports = [
  { method: 'POST', path: '/tokens', options: Tokens.ask },
  { method: 'DELETE', path: '/tokens', options: Tokens.revoke },
]
