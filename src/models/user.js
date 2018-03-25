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
  scope: Array,
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
  const enumValues = ['user', 'admin']

  // Remove duplicate values
  scope = [...new Set(scope)]

  // Remove empty values
  scope = scope.filter(item => item != '')

  // Check if the scope contains the enum values
  scope = scope.filter(item => enumValues.includes(item))

  // If no value return the default
  if (!scope.length) { return defaultValue }

  return scope
}

// ## Pre Methods

userSchema.pre('save', true, function (next, done) {
  this.scope = checkScope(this.scope)
  next(done())
})

userSchema.pre('update', true, function (next, done) {
  this._update.scope = checkScope(this._update.scope)
  next(done())
})

module.exports = Mongoose.model('User', userSchema)

