const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

const userSchema = new Mongoose.Schema({
  email: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    required: true,
    maxlength: 255
  },
  name: {
    type: String,
    trim: true,
    index: true,
    maxlength: 255
  },
  scope: Array
})

/**
 * Ensure the scope is filled only with accepted and unique values
 * And set the default scope
 *
 * @param {Array|string} val The value to check
 * @return {Array} The scope formated
 */
function checkScope(scope) {
  const defaultValue = ['user']
  const acceptedValues = ['user', 'admin']

  if (!scope || !scope.length) { return defaultValue }

  // Check if the array contains anly values in the values array
  scope = scope.filter(item =>
    acceptedValues.findIndex(x => x === item) !== -1
  )

  // Return an array with unique values
  return [...new Set(scope)]
}

// ## Pre Methods

userSchema.pre('save', true, function (next, done) {
  this.scope = checkScope(this.scope)
  next(done())
})

userSchema.pre('findOneAndUpdate', true, function (next, done) {
  this._update.scope = checkScope(this._update.scope)
  next(done())
})

module.exports = Mongoose.model('User', userSchema)

