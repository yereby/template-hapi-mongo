const Auth = require('../models/auth')

module.exports.validate = async (decoded, request) => {
  try {
    const result = await Auth.findOne({
      email: decoded.email,
      token: request.auth.token
    })

    if (!result) { return { isValid: false } }
    return { isValid: true }
  } catch(err) { throw err }
}
