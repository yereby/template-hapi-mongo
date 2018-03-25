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
  scope: { type: Array, default: ['user'] },
})

module.exports = Mongoose.model('User', userSchema)

