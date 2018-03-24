const Auth = require('../models/auth')

/**
 * Validate the token passed in the request
 *
 * We check this token and the email in its payload
 * are present in the auth collection
 */
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
