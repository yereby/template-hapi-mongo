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
  scope: {
    type: Array,
    default: 'user',
    enum: ['user', 'admin']
  }
})

// ## Virtuals properties

// Retourne le prénom
// On prend le nom complet avant le premier espace

userSchema.virtual('firstname').get(function firstname () {
  return this.name ? this.name.split(' ')[0] : null
})

// Retourne le ou les noms
// On prend le nom complet après le premier espace

userSchema.virtual('lastname').get(function lastname () {
  return this.name ? this.name.split(' ').slice(1, this.name.length).join(' ') : null
})

module.exports = Mongoose.model('User', userSchema)

