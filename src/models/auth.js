const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

const authSchema = new Mongoose.Schema({
  email: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  iat: Number,
})

module.exports = Mongoose.model('Auth', authSchema)
