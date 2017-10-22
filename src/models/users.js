const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

const userSchema = new Mongoose.Schema({
  email: { type: String, trim: true, index: true, unique: true, required: true, maxlength: 255 },
  name: { type: String, trim: true, index: true, required: true, maxlength: 255 },
  scope: { type: Array, default: 'user', enum: ['user', 'admin'] }
},
{ timestamps: true })

// ## Methods

userSchema.methods.create = function create (cb) {
  return this.save(cb)
}

// ## Statics

// ## Virtuals properties

// Retourne le prénom
// On prend le nom complet avant le premier espace

userSchema.virtual('firstname').get(function firstname () {
  return this.name.split(' ')[0]
})

// Retourne le ou les noms
// On prend le nom complet après le premier espace

userSchema.virtual('lastname').get(function lastname () {
  return this.name.split(' ').slice(1, this.name.length).join(' ')
})

module.exports = Mongoose.model('User', userSchema)

